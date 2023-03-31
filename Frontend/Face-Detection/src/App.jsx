import { useState,useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { Form, Input, Button } from 'antd';
import {  Modal } from "antd";
import Webcam from 'react-webcam';

function App() {
  const webcamRef = useRef(null);

  const [isCameraVisible, setIsCameraVisible] = useState(false);

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
    onCapture(imageSrc);
  };
 


  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };


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
      <Button type="primary" onClick={handleCameraClick}>
        Activate camera
      </Button>
      <Modal open={isCameraVisible} onCancel={handleCancel} footer={null}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: '100%', maxWidth: '500px' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button onClick={capture}>Capture</Button>
      </div>
    </Modal>
     
    </Form.Item>
  </Form>
  )
}

export default App
