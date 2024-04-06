import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Slider, Row, Col } from 'antd';
import ApiService from '../helpers/ApiService';

const EditSlider = (props) => {
  
    const [sliderValue, setSliderValue] = useState(1);
    const [prevSliderAction, setAction] = useState(props.slider_action);
    

    const handleSettings = async (props, value, save, revert) => {
        let data = { ...props, 
            factor : value,
            save : save,
            revert : revert,
        }
        let imageUrl = await ApiService.handleSettings(data)
        props.updateImageToState(imageUrl)
    };

    useEffect(() => {

        if(prevSliderAction !== props.slider_action) {
            setSliderValue(1)
        }
        setAction(props.slider_action);
  }, [props.slider_action]);
  
    const handleSliderChange = async (value) => {
        setSliderValue(value)
        value = value/1000
        handleSettings(props, value, 0, 0)
    };
  
    const handleSave = async () => {
        const value = sliderValue/1000
        handleSettings(props, value,1, 0)
    };
  
    const handleRevert = async () => {
        const value = sliderValue/1000
        handleSettings(props, value, 0, 1)
        setSliderValue(1)
    };

  return (
    props.show_slider &&
    <Row style={{ display: 'flex', alignItems: 'center', marginTop: '40px' }}>
        <Col span={6}></Col>
        <Col span={6}>
            <Slider min={1}
                max={5000}
                value={sliderValue}
                onAfterChange={handleSliderChange}
            />
        </Col>
        <Col span={6}>
            <Button type="primary" style={{ marginLeft: 10 }} onClick={handleSave}>
                Save
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={handleRevert}>
                Revert
            </Button>
        </Col>
    </Row>
  );
};

export default EditSlider;
