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
    image1_data = base64.b64decode(image1_base64)
    with open('temp_img.jpg', 'wb') as f:
        f.write(image1_data) 
    # imagen de la base de datos
    eduardo_image = face_recognition.load_image_file("./images/yo.jpg") ## imagen de origen
    image1 = face_recognition.load_image_file('temp_img.jpg')
    face_encodings1 = face_recognition.face_encodings(image1)
    face_encodings2 = face_recognition.face_encodings(eduardo_image)


    # Comparar las codificaciones de los rostros
    if len(face_encodings1) > 0 and len(face_encodings2) > 0:
        match_results = face_recognition.compare_faces([face_encodings1[0]], face_encodings2[0])
        is_match = match_results[0]
        print(is_match)
        # Eliminar el archivo temporal
        os.remove('temp_img.jpg')
        api_error = ApiError(200, 'Comparacion de Rostro Exitosa')
        return jsonify(api_error.to_json()), api_error.status_code
    else:
        is_match = False
        print(is_match)
        # Eliminar el archivo temporal
        os.remove('temp_img.jpg')
        api_error = ApiError(400, 'No se pudo Verificar la identidad')

        return jsonify(api_error.to_json()), api_error.status_code



if __name__ == '__main__':
    app.run(debug=True,port=4000)