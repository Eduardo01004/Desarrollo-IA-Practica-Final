import { useState,useRef,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { Form, Input, Button } from 'antd';
import {  Modal } from "antd";
import Webcam from 'react-webcam';

function App() {
  const videoRef = useRef(null);

  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [imageData, setImageData] = useState(null);


  const takeSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setImageData(dataUrl);
  };
  const handleCameraClick = () => {
    setIsCameraVisible(true);
  };

  const handleOk = () => {
    setIsCameraVisible(false);
  };

  const handleCancel = () => {
    setIsCameraVisible(false);
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    console.log(imageSrc)
  };

  const openCamera = () => {
    setIsCameraVisible(true);
     navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        //console.log(stream)
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
        <img src={imageData} alt="Snapshot" />
      )}
    </Modal>
   
    </Form.Item>
  </Form>
  )
}

export default App
