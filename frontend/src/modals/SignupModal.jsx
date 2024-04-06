import React from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import ApiServiceHelper from '../helpers/ApiServiceHelper';

function SignupModal(props) {

  const doSignup = async (data) => {
    try {
        const response = await ApiServiceHelper.post('user/signup', data); // Replace '/endpoint' with your API endpoint
        console.log('POST response:', response);
        props.updateSignupModal(false)
        props.updateLoginModal(true)
        message.success('Signup Successful!');
    } catch (error) {
      message.error("Something went wrong. Please Try again leter!")
      props.updateSignupModal(false)
    }
  };

    return (
    <>
      <Modal
        title={props.title}
        style={{ top: 120 }}
        open={props.signup_modal_open}
        // onOk={() => props.updateState(false)}
        onCancel={() => props.updateSignupModal(false)}
        width={500}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={doSignup.bind(this)}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              { required: true, message: 'Please enter your first name' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[
              { required: true, message: 'Please enter your last name' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
};

export default SignupModal;