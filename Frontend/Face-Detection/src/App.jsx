import { useState,useRef,useEffect } from 'react'
import './App.css'
import React from 'react';
import { Form, Input, Button } from 'antd';
import {  Modal } from "antd";
import Swal from 'sweetalert';
import axios from 'axios';



function App() {

  const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    withCredentials: true, // habilita CORS
  });
  
  const videoRef = useRef(null);

  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [imageData, setImageData] = useState(null);

  const headers = {
    'Content-Type': 'application/json',
    withCredentials: true,
  };

  const data = {
    image:imageData
    };



  const takeSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setImageData(dataUrl);
    //console.log(imageData)
    axios.post('http://127.0.0.1:5000/compare', data, { withCredentials: true })
    .then(response => {
        // código para manejar la respuesta exitosa
        console.log(response)
        Swal.fire({
          title: 'Alerta',
          text: 'Usuario Verificado',
          timer: 2000,
          timerProgressBar: true,
          icon: 'success',
        }).then(() => {
          window.location.reload();
        });
    })
    .catch(error => {
        // código para manejar el error
        console.log(error)
    });
  };


  const enviarDatos  = async () =>{

    console.log(imageData)
    axios.post('http://127.0.0.1:5000/compare', data, { headers })
    .then(response => {
        // código para manejar la respuesta exitosa
        console.log(response)
        Swal.fire({
          title: 'Alerta',
          text: 'Usuario Verificado',
          timer: 2000,
          timerProgressBar: true,
          icon: 'success',
        }).then(() => {
          window.location.reload();
        });
    })
    .catch(error => {
        // código para manejar el error
        console.log(error)
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
        Activate camera
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
      <Button onClick={takeSnapshot}>Take Snapshot</Button>
      {imageData && (
        console.log(imageData)
      )}
    </Modal>
   
    </Form.Item>
  </Form>
  )
}

export default App
