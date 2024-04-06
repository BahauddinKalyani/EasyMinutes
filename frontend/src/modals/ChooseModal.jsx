import React, {useEffect, useState} from 'react';
import { Modal } from 'antd';
import PreviewImageGallery from '../edit_screen/PreviewImageGallery'
import ApiService from '../helpers/ApiService';

function ChooseModal(props) {
    const handleImageSelect = (selectedImage) => {
        props.updateImageToState(selectedImage);
        props.updateChooseModal(false)
    };
    const [images, setImages] = useState(null);
    const [isApiCalled, setIsApiCalled] = useState(false);

    useEffect(() => {
        if(!isApiCalled) {
            const fetchData = async () => {
                try {
                    const urls = await ApiService.getAllImages(props);
                    let data = []
                    urls.forEach((url) => {
                        data.push({src: url})
                    });
                    console.log(data)
                    setImages(data);
                    setIsApiCalled(true)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
        
    }, []);
  
  return (
    <>
        <Modal
            title={props.title}
            style={{ top: 120 }}
            open={props.choose_modal_open}
            onCancel={() => props.updateChooseModal(false)}
            width={900}
            footer={null}
        >
            <PreviewImageGallery previewImages={images} onSelect={handleImageSelect}/>
        </Modal>
    </>
  )
};

export default ChooseModal;