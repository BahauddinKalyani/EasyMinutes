import React from 'react';
import { Button, Modal, message } from 'antd';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function UploadModal(props) {
    const props1 = {
        beforeUpload: (file) => {
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                props.setImageUrl(imageUrl, true);
                props.updateUploadModal(false)
              } else {
                message.error('Please select a file to upload.');
              }
            return false
        },
      };
  
  return (
    <>
        <Modal
            title={props.title}
            style={{ top: 120 }}
            open={props.upload_modal_open}
            onCancel={() => props.updateUploadModal(false)}
            width={500}
            footer={null}
        >
            <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', width:'29vw', height: '15vh' }}>
                <Upload {...props1} showUploadList={false} style={{ marginTop: '10px'}}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
            </div>
        </Modal>
    </>
  )
};

export default UploadModal;