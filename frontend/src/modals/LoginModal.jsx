import React from 'react';
import { Button, Modal, message } from 'antd';
import { Checkbox, Form, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import ApiServiceHelper from '../helpers/ApiServiceHelper';

function LoginModal(props) {
    const navigate = useNavigate();
    const doLogin = async (data) => {
        try {
            // const response = await ApiServiceHelper.post('user/login', data);
            // console.log(response)
            // props.updateLoginModal(false)
            // localStorage.setItem('jwtToken', response.jwt);
            // navigate('/edit', { state: response });
            navigate('/transcribe', { });
            message.success('Login Successful!');
        } catch (error) {
            console.log(error)
            message.error("Something went wrong. Please Try again leter!")
        }
    }
  
  return (
    <>
      <Modal
        title={props.title}
        style={{ top: 120 }}
        open={props.login_modal_open}
        onCancel={() => props.updateLoginModal(false)}
        width={500}
        footer={null}
      >
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={doLogin.bind(this)}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="email"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Login
                </Button>
            </Form.Item>
        </Form>
      </Modal>
    </>
  )
};

export default LoginModal;