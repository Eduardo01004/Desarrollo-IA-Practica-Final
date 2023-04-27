import face_recognition
import numpy as np
from flask import Flask, jsonify, request
import base64
import os
from src.models.api_error import ApiError
from flask_cors import CORS,cross_origin


app = Flask(__name__)
cors = CORS(app)



@app.route('/')
def home():
    return 'Hello World'






@app.route('/api/compare', methods=['POST'])
def compare():
    # Obtener las imágenes en base64 desde el frontend
    image1_base64 = request.json['image']
    image2_base64 = request.json['compare']
    # crear una imagen temporal1
    image1_data = base64.b64decode(image1_base64)
    with open('temp_img.jpg', 'wb') as f:
        f.write(image1_data) 

    image2_data = base64.b64decode(image2_base64)
    with open('temp2_img.jpg', 'wb') as fi:
        fi.write(image2_data) 

    # Cargar las imágenes y detectar los rostros
    eduardo_image = face_recognition.load_image_file("temp2_img.jpg")  # imagen de origen
    image1 = face_recognition.load_image_file('temp_img.jpg')
    face_encodings1 = face_recognition.face_encodings(image1)
    face_encodings2 = face_recognition.face_encodings(eduardo_image)

    # Comparar las codificaciones de los rostros
    is_match = False
    for face_encoding1 in face_encodings1:
        for face_encoding2 in face_encodings2:
            match_results = face_recognition.compare_faces([face_encoding1], face_encoding2)
            if match_results[0]:
                is_match = True
                break

    # Eliminar el archivo temporal
    os.remove('temp_img.jpg')
    os.remove('temp2_img.jpg')

    if is_match:
        api_error = ApiError(200, 'Comparacion de Rostro Exitosa')
        print("se comparo bien")
    else:
        api_error = ApiError(400, 'No se pudo Verificar la identidad')
        print(" se comparo mal")
        
    return jsonify(api_error.to_json()), api_error.status_code




if __name__ == '__main__':
    app.run(debug=True,port=4000)