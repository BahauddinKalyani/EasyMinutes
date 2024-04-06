import React from 'react';
import { Spin } from 'antd';

const MainImage = ({ imageUrl, is_updated, spinning }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60vw', height: 'auto', marginTop: '50px' }}>
      {imageUrl && is_updated && <Spin tip="Loading" size="large" spinning={spinning} ><img src={`${imageUrl}?${is_updated}`} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} /></Spin>}
    </div>
  );
};

export default MainImage;