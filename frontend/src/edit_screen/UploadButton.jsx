import React from 'react';
import { Upload, Button, message, Typography, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { Title } = Typography;

const UploadButton = (props) => {
  const props1 = {
    beforeUpload: (file) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            props.setImageUrl(imageUrl);
          } else {
            message.error('Please select a file to upload.');
          }
        return false
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', width:'65vw', height: '80vh' }}>
      <Title level={4}>Unleash Your Creativity with Our Image Magic! 🌟 Upload, Edit, and Transform Your Photos Today!</Title>
      <br />
      <br />
      <Upload {...props1} showUploadList={false} style={{ marginTop: '10px'}}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </div>
  );
};

export default UploadButton;
