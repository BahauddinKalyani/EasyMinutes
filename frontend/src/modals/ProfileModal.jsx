import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import ApiServiceHelper from '../helpers/ApiServiceHelper';

function ProfileModal(props) {

    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });
    const [isApiCalled1, setIsApiCalled] = useState(false);

    useEffect(() => {
        if(!isApiCalled1) {
            const fetchData1 = async () => {
                try {
                    const header = {
                        jwt_token: props.jwtToken
                    }
                    const response = await ApiServiceHelper.get('user/get_user_details', header);
                    delete response.message;
                    setUser(response)
                    setIsApiCalled(true)
                } catch (error) {
                    message.error("Something went wrong. Please Try again leter!")
                    console.error('Error fetching data:', error);
                }
            }
            fetchData1();
        }; 
    }, []);

    const updateProfile = async (data) => {
        try {
            const header = {
                jwt_token: props.jwtToken
            }
            const response = await ApiServiceHelper.post('user/update_user_details', data, header);
            delete response.message;
            if(data.password !== user.password){
                window.location.href = "/"
            }
            setUser(response)
            props.updateProfileModal(false)
            message.success('Update Successful!');
        } catch (error) {
            message.error("Something went wrong. Please Try again leter!")
            props.updateProfileModal(false)
        }
    };

    return (
    <>
      <Modal
        title={props.title}
        style={{ top: 120 }}
        open={props.profile_modal_open}
        // onOk={() => props.updateState(false)}
        onCancel={() => props.updateProfileModal(false)}
        width={500}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={updateProfile.bind(this)}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              { required: true, message: 'Please enter your first name' },
            ]}
            initialValue={user.first_name}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[
              { required: true, message: 'Please enter your last name' },
            ]}
            initialValue={user.last_name}
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
            initialValue={user.email}
          >
            <Input disabled={true} style={{color: '#fff'}} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
            initialValue={user.password}
          >
            <Input.Password/>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
};

export default ProfileModal;