from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os
from utils.preprocess import preprocess_image
from utils.predict import predict_image

app = Flask(__name__)
CORS(app)

# Load your trained model
MODEL_PATH = os.path.join("saved_model", "cnn_mobilenetv2.h5")
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model loaded successfully!")

@app.route("/")
def home():
    return jsonify({"message": "Cervical Cancer Model API is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
        
        image_file = request.files['image']
        image_bytes = image_file.read()

        # Preprocess and predict
        preprocessed_image = preprocess_image(image_bytes)
        result, confidence = predict_image(model, preprocessed_image)

        return jsonify({
            "result": result,
            "confidence": float(confidence)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
