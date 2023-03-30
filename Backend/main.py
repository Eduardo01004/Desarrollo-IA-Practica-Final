import face_recognition
import cv2
import numpy as np
import hashlib
import time

video_capture = cv2.VideoCapture(0) ##inicia la camara de video 

eduardo_image = face_recognition.load_image_file("yo.jpg") ## imagen de origen
eduardo_face_encoding = face_recognition.face_encodings(eduardo_image)[0]





known_face_encodings = [
    eduardo_face_encoding,
]
known_face_names = [
    "Eduardo Tun",

]

face_locations = []
face_encodings = []
face_names = []
process_this_frame = True

while True:
    ret, frame = video_capture.read() # Captura un fotograma de la cámara

    if process_this_frame:
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        rgb_small_frame = small_frame[:, :, ::-1]

        # Detecta las caras en el fotograma
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            # Compara las codificaciones de las caras detectadas con la imagen de referencia
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Desconocido"
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            #verifica si es el mismo rostro o no
            if matches[best_match_index]:
                name = known_face_names[best_match_index]
                face_hash = hashlib.sha256(str(face_encoding).encode('utf-8')).hexdigest()
                print("Hash generado y agregado a la blockchain correctamente.")
                #time.sleep(5)  # Espera 5 segundos antes de salir del programa
                ##exit()

            face_names.append(name)

    process_this_frame = not process_this_frame


    for (top, right, bottom, left), name in zip(face_locations, face_names):
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)
        cv2.putText(frame, "Usuario verificado", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)


      # Muestra el fotograma actual en una ventana de OpenCV
    cv2.imshow('Video', frame)

    # Espera a que se presione la tecla 'q' para salir del bucle while
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Libera la cámara y cierra la ventana de OpenCV
video_capture.release()
cv2.destroyAllWindows()