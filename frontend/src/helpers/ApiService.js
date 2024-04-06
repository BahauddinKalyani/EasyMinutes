import ApiServiceHelper from './ApiServiceHelper';
import { message } from 'antd';

// const API_BASE_URL = 'http://localhost:8000';

const ApiService = {

    replaceBackground: async (props) => {
        try {
            props.updateSpinFlag(true)
            const data = {
                image_url: props.imageUrl,
                background_url: props.backgroundImageUrl
            }
            const header = {
                jwt_token: props.jwtToken
            }
            const response = await ApiServiceHelper.post('image/background_replace', data, header);
            props.updateSpinFlag(false)
            return response.url
        } catch(error) {
            props.updateSpinFlag(false)
            message.error("Something went wrong. Please Try again leter!")
        }
        return props.imageUrl
    },

    handleAction: async (props) => {
        try {
            props.updateSpinFlag(true)
            const data = {
                image_url: props.imageUrl,
            }
            const header = {
                jwt_token: props.jwtToken
            }
            const response = await ApiServiceHelper.post('image/'+props.api_url, data, header);
            props.updateSpinFlag(false)
            return response.url
        } catch(error) {
            props.updateSpinFlag(false)
            message.error("Something went wrong. Please Try again leter!")
        }
        return props.imageUrl
    },

    handleSettings: async (props) => {
        try {
            props.updateSpinFlag(true)
            const data = {
                image_url: props.imageUrl,
                factor: props.factor,
                save: props.save,
                revert: props.revert,
            }
            const header = {
                jwt_token: props.jwtToken
            }
            const response = await ApiServiceHelper.post('image/'+props.slider_action, data, header);
            props.updateSpinFlag(false)
            return response.url
        } catch(e) {
            props.updateSpinFlag(false)
            message.error("Something went wrong. Please Try again leter!")
        }
        return props.imageUrl
        
    },

    getAllImages: async (props) => {
        try {
            const header = {
                jwt_token: props.jwtToken
            }
            const response = await ApiServiceHelper.get('image/get_user_images', header);
            console.log(response)
            return response.url
        } catch(e) {
            message.error("Something went wrong. Please Try again leter!")
        }
    }
};

export default ApiService;