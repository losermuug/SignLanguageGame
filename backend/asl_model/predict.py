import base64
import json
import os
import sys
from io import BytesIO
from pathlib import Path


DEFAULT_LABELS = [
    " ",
    "!",
    "#",
    "$",
    "%",
    "&",
    "'",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    ".",
    "/",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ":",
    ";",
    "=",
    "?",
    "@",
    "[",
    "_",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "~",
]
STATIC_LETTER_LABELS = set("abcdefghiklmnopqrstuvwxy")


def read_payload():
    try:
        return json.loads(sys.stdin.read())
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON payload: {exc}") from exc


def write_response(response):
    print(json.dumps(response), flush=True)


def decode_image(data_url):
    from PIL import Image

    if "," not in data_url:
        raise ValueError("Image must be a data URL")
    _, encoded = data_url.split(",", 1)
    raw = base64.b64decode(encoded)
    return Image.open(BytesIO(raw)).convert("RGB")


def load_labels(labels_path):
    path = Path(labels_path)
    if not path.exists():
        return DEFAULT_LABELS

    labels = []
    for line in path.read_text().splitlines():
        value = line.rstrip("\n")
        if value == "<space>":
            labels.append(" ")
        elif value:
            labels.append(value)
    return labels or DEFAULT_LABELS


def find_model_path(model_path):
    path = Path(model_path)
    if path.is_file():
        return path

    candidates = [
        *path.glob("*.tflite"),
        *path.glob("*.keras"),
        *path.glob("*.h5"),
        *path.glob("**/saved_model.pb"),
    ]
    if not candidates:
        raise FileNotFoundError(
            f"No TensorFlow model found in {path}. Put .tflite, .keras, .h5, or SavedModel files there."
        )

    candidate = candidates[0]
    return candidate.parent if candidate.name == "saved_model.pb" else candidate


def input_size_from_shape(shape):
    dims = [int(dim) if dim is not None else None for dim in shape]
    if len(dims) != 4:
        raise ValueError(f"Expected an image model with rank-4 input, got shape {shape}")

    if dims[1] in (1, 3):
        height = dims[2] or 224
        width = dims[3] or 224
        channels_first = True
    else:
        height = dims[1] or 224
        width = dims[2] or 224
        channels_first = False

    return width, height, channels_first


def prepare_image(image, width, height, channels_first=False):
    import numpy as np

    resized = image.resize((width, height))
    array = np.asarray(resized, dtype=np.float32) / 255.0
    if channels_first:
        array = np.transpose(array, (2, 0, 1))
    return np.expand_dims(array, axis=0)


def softmax(values):
    import numpy as np

    values = np.asarray(values, dtype=np.float64)
    values = values - np.max(values)
    exp = np.exp(values)
    return exp / np.sum(exp)


def read_features(payload):
    features = payload.get("features")
    if features is None:
        return None
    if len(features) != 156:
        raise ValueError(f"Expected 156 landmark features, got {len(features)}")
    return features


class TfliteFeaturePredictor:
    def __init__(self, model_path):
        import tensorflow as tf

        self.interpreter = tf.lite.Interpreter(model_path=str(model_path))
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()[0]
        self.output_details = self.interpreter.get_output_details()[0]
        self.expected = int(self.input_details["shape"][-1])

    def predict(self, features):
        import numpy as np

        if self.expected != len(features):
            raise ValueError(f"Model expects {self.expected} features, got {len(features)}")

        tensor = np.asarray([features], dtype=self.input_details["dtype"])
        self.interpreter.set_tensor(self.input_details["index"], tensor)
        self.interpreter.invoke()
        return self.interpreter.get_tensor(self.output_details["index"])[0]


def run_tflite_features(model_path, features):
    import numpy as np
    import tensorflow as tf

    interpreter = tf.lite.Interpreter(model_path=str(model_path))
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()[0]
    output_details = interpreter.get_output_details()[0]
    expected = int(input_details["shape"][-1])
    if expected != len(features):
        raise ValueError(f"Model expects {expected} features, got {len(features)}")

    tensor = np.asarray([features], dtype=input_details["dtype"])
    interpreter.set_tensor(input_details["index"], tensor)
    interpreter.invoke()
    return interpreter.get_tensor(output_details["index"])[0]


def run_tflite_image(model_path, image):
    import numpy as np
    import tensorflow as tf

    interpreter = tf.lite.Interpreter(model_path=str(model_path))
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()[0]
    output_details = interpreter.get_output_details()[0]
    width, height, channels_first = input_size_from_shape(input_details["shape"])
    tensor = prepare_image(image, width, height, channels_first)

    if input_details["dtype"] == np.uint8:
        scale, zero_point = input_details["quantization"]
        tensor = tensor / scale + zero_point
        tensor = tensor.astype(np.uint8)
    else:
        tensor = tensor.astype(input_details["dtype"])

    interpreter.set_tensor(input_details["index"], tensor)
    interpreter.invoke()
    return interpreter.get_tensor(output_details["index"])[0]


def normalize_prediction(raw_scores, labels):
    import numpy as np

    scores = np.asarray(raw_scores).reshape(-1)
    if len(scores) != len(labels):
        raise ValueError(
            f"Model returned {len(scores)} scores, but {len(labels)} labels are configured."
        )

    if np.min(scores) < 0 or np.max(scores) > 1.0 or not np.isclose(np.sum(scores), 1.0, atol=0.05):
        scores = softmax(scores)

    letter_indices = [
        index
        for index, label in enumerate(labels)
        if label.lower() in STATIC_LETTER_LABELS
    ]
    if not letter_indices:
        raise ValueError("No alphabet labels found in label map")

    letter_scores = scores[letter_indices]
    best_letter_offset = int(np.argmax(letter_scores))
    best_index = letter_indices[best_letter_offset]
    confidence = float(scores[best_index])
    label = labels[best_index]
    top_count = min(5, len(letter_indices))
    top_indices = [
        letter_indices[index] for index in np.argsort(letter_scores)[-top_count:][::-1]
    ]

    return {
        "letter": label.upper() if len(label) == 1 and label.isalpha() else label,
        "confidence": confidence,
        "top": [
            {
                "letter": labels[index].upper()
                if len(labels[index]) == 1 and labels[index].isalpha()
                else labels[index],
                "confidence": float(scores[index]),
            }
            for index in top_indices
        ],
        "source": "tensorflow-lite",
    }


def main():
    payload = read_payload()
    model_path = find_model_path(os.environ.get("ASL_MODEL_PATH", "models/asl/model.tflite"))
    labels = load_labels(os.environ.get("ASL_LABELS_PATH", "models/asl/labels.txt"))
    features = read_features(payload)

    if features is not None:
        if model_path.suffix != ".tflite":
            raise ValueError("Landmark feature inference requires a .tflite model")
        raw_scores = run_tflite_features(model_path, features)
    else:
        image = decode_image(payload.get("image", ""))
        raw_scores = run_tflite_image(model_path, image)

    write_response(normalize_prediction(raw_scores, labels))


def serve():
    model_path = find_model_path(os.environ.get("ASL_MODEL_PATH", "models/asl/model.tflite"))
    labels = load_labels(os.environ.get("ASL_LABELS_PATH", "models/asl/labels.txt"))
    predictor = TfliteFeaturePredictor(model_path)
    write_response({"ready": True, "source": "tensorflow-lite"})

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        try:
            payload = json.loads(line)
            request_id = payload.get("id")
            features = read_features(payload)
            if features is None:
                raise ValueError("Server mode expects landmark features")

            response = normalize_prediction(predictor.predict(features), labels)
            if request_id is not None:
                response["id"] = request_id
            write_response(response)
        except Exception as exc:
            response = {"letter": None, "confidence": 0, "error": str(exc)}
            if "request_id" in locals() and request_id is not None:
                response["id"] = request_id
            write_response(response)


if __name__ == "__main__":
    try:
        if "--server" in sys.argv:
            serve()
        else:
            main()
    except Exception as exc:
        write_response({"letter": None, "confidence": 0, "error": str(exc)})
        sys.exit(1)
