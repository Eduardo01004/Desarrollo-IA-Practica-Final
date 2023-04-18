import { useState,useRef,useEffect } from 'react'
import './App.css'
import React from 'react';
import { Form, Input, Button } from 'antd';
import {  Modal } from "antd";
import Swal from 'sweetalert2'; // Importa SweetAlert
import axios from 'axios';



function App() {


  
  const videoRef = useRef(null);

  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [imageData, setImageData] = useState(null);

  const headers = {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:5173' // Reemplaza con la URL de tu aplicación React Vite

  };


  const data = {
    image:imageData
    };



  const takeSnapshot =  () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    const splitArray = dataUrl.split(',');
    setImageData(splitArray[1]);
    //console.log(imageData)

   
  };

  const enviarData = () =>{

    axios.post('http://localhost:4000/api/compare',
    {
      image:imageData
    }
      )
    .then(response => {
      console.log(response.status)
        // código para manejar la respuesta exitosa
        console.log(response)

        if (response.status === 200){
          Swal.fire({
            title: 'Login',
            text: 'Usuario Verificado',
            timer: 2000,
            timerProgressBar: true,
            icon: 'success',
          })
        }else {
          
        }
        
    })
    .catch(error => {
        // código para manejar el error
        console.log(error)
        Swal.fire({
          title: 'Alerta',
          text: 'Usuario No Verificado',
          timer: 2000,
          timerProgressBar: true,
          icon: 'Error',
        })
    });

  }

 


  const handleCameraClick = () => {
    setIsCameraVisible(true);
  };

  const handleOk = () => {
    setIsCameraVisible(false);
  };

  const handleCancel = () => {
    setIsCameraVisible(false);
  };


  const openCamera = () => {
    setIsCameraVisible(true);
     navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setVideoStream(stream);
      })
      .catch((error) => {
        console.log("Unable to access camera:", error);
      });
  };

  const closeCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        track.stop();
      });
      setVideoStream(null);
    }
  };

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);



  return (
    <Form
    name="login-form"
    initialValues={{ remember: true }}
    onFinish={onFinish}
    style={{ maxWidth: 400, margin: 'auto' }}
  >
    <Form.Item
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input placeholder="Username" />
    </Form.Item>

    <Form.Item
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password placeholder="Password" />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Log in
      </Button>
    </Form.Item>

    <Form.Item>
      <Button type="primary" onClick={openCamera}>
        Log In por Camara
      </Button>


      <Modal
      title="Camera Modal"
      open={isCameraVisible}
      onCancel={handleCancel}
      afterClose={closeCamera}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <div>
        {videoStream && (
          <video
          ref={videoRef}
          autoPlay
          style={{ width: '480px', height: '480px' }}
          
        />
        )  } 
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={takeSnapshot}>Capturar</button>
        <button onClick={enviarData}>Loguear</button>
      </div>
    </Modal>
   
    </Form.Item>
  </Form>
  )
}

export default App
