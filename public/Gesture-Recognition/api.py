import base64
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from src.hand_tracker_nms import HandTrackerNMS
import src.extra

app = Flask(__name__)
CORS(app)

PALM_MODEL_PATH = "models/palm_detection_without_custom_op.tflite"
LANDMARK_MODEL_PATH = "models/hand_landmark.tflite"
ANCHORS_PATH = "models/anchors.csv"

detector = HandTrackerNMS(
    PALM_MODEL_PATH,
    LANDMARK_MODEL_PATH,
    ANCHORS_PATH,
    box_shift=0.2,
    box_enlarge=1.3
)

gesture_clf = joblib.load(r'models/gesture_clf.pkl')
int_to_char = src.extra.classes

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({"error": "No image provided"}), 400
    
    try:
        img_data = data['image'].split(',')[1]
        nparr = np.frombuffer(base64.b64decode(img_data), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({"error": "Invalid image"}), 400
            
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        points, bboxes, joints = detector(image)
        
        if points is None:
            return jsonify({
                "hand_detected": False,
                "letter": None,
                "landmarks": []
            })
            
        pred_sign = src.extra.predict_sign(joints, gesture_clf, int_to_char)
        
        height, width, _ = frame.shape
        normalized_landmarks = []
        for (px, py) in points:
            normalized_landmarks.append({
                "x": float(px) / width,
                "y": float(py) / height
            })
            
        distances = src.extra.calc_distances(joints)
        distances_arr = np.expand_dims(distances, axis=0)
        
        if hasattr(gesture_clf, "predict_proba"):
            probas = gesture_clf.predict_proba(distances_arr)[0]
            top5_idx = np.argsort(probas)[-5:][::-1]
            top5 = []
            for idx in top5_idx:
                top5.append({
                    "letter": int_to_char[idx],
                    "confidence": float(probas[idx])
                })
            confidence = float(probas[top5_idx[0]])
        else:
            top5 = [{"letter": pred_sign, "confidence": 1.0}]
            confidence = 1.0
            
        return jsonify({
            "hand_detected": True,
            "letter": pred_sign,
            "confidence": confidence,
            "top5": top5,
            "landmarks": normalized_landmarks
        })
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
