import React from 'react';
import { Row, Col, Image } from 'antd';

const PreviewImageGallery = ({ previewImages, onSelect }) => {
  const handleImageClick = (selectedImage) => {
    onSelect(selectedImage);
  };

  if (previewImages.length === 0) {
    return <p>No images to select</p>;
  }

  return (
    <Row gutter={16}>
      {previewImages.map((image, index) => (
        <Col key={index} span={6} style={{ padding: '10px' }}>
          <Image
            src={image.src}
            width={200}
            preview={false}
            onClick={() => handleImageClick(image.src)}
            style={{ cursor: 'pointer' }}
          />
        </Col>
      ))}
    </Row>
  );
};

export default PreviewImageGallery;