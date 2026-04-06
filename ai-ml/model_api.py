from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import tensorflow as tf
import cv2, numpy as np, os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Load model
MODEL_PATH = "./saved_model/cnn_mobilenetv2.h5"
model = load_model(MODEL_PATH, compile=False)

# Preprocess function
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    file = request.files['image']
    
    filename = secure_filename(file.filename)
    filepath = os.path.join("/tmp", filename)   # ✅ safer for Render
    file.save(filepath)

    img = preprocess_image(filepath)
    prediction = model.predict(img)

    result = float(prediction[0][0])
    label = "Cancerous" if result > 0.5 else "Normal"

    return jsonify({
        "label": label,
        "confidence": result
    })

