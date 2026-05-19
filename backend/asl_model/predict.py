import json
import os
import sys
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
LETTER_LABELS = set("abcdefghijklmnopqrstuvwxyz")
TFLITE_MODEL_PATH = "models/asl/model.tflite"
TFLITE_LABELS_PATH = "models/asl/labels.txt"


def read_payload():
    try:
        return json.loads(sys.stdin.read())
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON payload: {exc}") from exc


def write_response(response):
    print(json.dumps(response), flush=True)


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


def default_model_path():
    return TFLITE_MODEL_PATH


def default_labels_path():
    return TFLITE_LABELS_PATH


def find_model_path(model_path):
    path = Path(model_path)
    if path.is_file():
        return path

    candidates = [
        *path.glob("*.tflite"),
    ]
    if not candidates:
        raise FileNotFoundError(
            f"No TensorFlow Lite model found in {path}. Put a .tflite model there."
        )

    candidate = candidates[0]
    return candidate.parent if candidate.name == "saved_model.pb" else candidate


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
    source = "tensorflow-lite"

    def __init__(self, model_path):
        import tensorflow as tf

        self.interpreter = tf.lite.Interpreter(model_path=str(model_path))
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()[0]
        self.output_details = self.interpreter.get_output_details()[0]
        self.expected = int(self.input_details["shape"][-1])

    def predict(self, payload):
        import numpy as np

        features = read_features(payload)
        if features is None:
            raise ValueError("TFLite feature model expects landmark features")
        if self.expected != len(features):
            raise ValueError(f"Model expects {self.expected} features, got {len(features)}")

        tensor = np.asarray([features], dtype=self.input_details["dtype"])
        self.interpreter.set_tensor(self.input_details["index"], tensor)
        self.interpreter.invoke()
        return self.interpreter.get_tensor(self.output_details["index"])[0]


def create_predictor(model_path):
    if model_path.suffix == ".tflite":
        return TfliteFeaturePredictor(model_path)
    raise ValueError(f"Unsupported server model format: {model_path.suffix}")


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


def format_label(label):
    return label.upper() if len(label) == 1 and label.isalpha() else label


def normalize_prediction(raw_scores, labels, source):
    import numpy as np

    scores = np.asarray(raw_scores).reshape(-1)
    if len(scores) != len(labels):
        raise ValueError(
            f"Model returned {len(scores)} scores, but {len(labels)} labels are configured."
        )

    if np.min(scores) < 0 or np.max(scores) > 1.0 or not np.isclose(np.sum(scores), 1.0, atol=0.05):
        scores = softmax(scores)

    letter_indices = [index for index, label in enumerate(labels) if label.lower() in LETTER_LABELS]
    if not letter_indices:
        raise ValueError("No alphabet labels found in label map")

    best_index = int(np.argmax(scores))
    best_label = labels[best_index]
    confidence = float(scores[best_index])
    top_count = min(5, len(scores))
    top_indices = np.argsort(scores)[-top_count:][::-1]

    return {
        "letter": format_label(best_label) if best_label.lower() in LETTER_LABELS else None,
        "confidence": confidence,
        "top": [
            {
                "letter": format_label(labels[index]),
                "confidence": float(scores[index]),
            }
            for index in top_indices
        ],
        "source": source,
    }


def main():
    payload = read_payload()
    configured_model = os.environ.get("ASL_MODEL_PATH", default_model_path())
    model_path = find_model_path(configured_model)
    labels = load_labels(os.environ.get("ASL_LABELS_PATH", default_labels_path()))
    predictor = create_predictor(model_path)
    write_response(normalize_prediction(predictor.predict(payload), labels, predictor.source))


def serve():
    configured_model = os.environ.get("ASL_MODEL_PATH", default_model_path())
    model_path = find_model_path(configured_model)
    labels = load_labels(os.environ.get("ASL_LABELS_PATH", default_labels_path()))
    predictor = create_predictor(model_path)
    write_response({"ready": True, "source": predictor.source})

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        request_id = None
        try:
            payload = json.loads(line)
            request_id = payload.get("id")

            response = normalize_prediction(predictor.predict(payload), labels, predictor.source)
            if request_id is not None:
                response["id"] = request_id
            write_response(response)
        except Exception as exc:
            response = {"letter": None, "confidence": 0, "error": str(exc)}
            if request_id is not None:
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
