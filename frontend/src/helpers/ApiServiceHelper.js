import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const ApiServiceHelper = {
  // Helper function to make GET requests
    get: async (endpoint, headers = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {headers, mode: 'no-cors', withCredentials: false});
            return response.data;
        } catch (error) {
            console.error('Error:', error.response.status);
            if(error.response.status == 401){
                window.location.href = "/"
            }
            throw error;
        }
    },

  // Helper function to make POST requests
    post: async (endpoint, data = {}, header = {}) => {
        console.log(header)
        try {
            const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data, {headers: header, mode: 'no-cors', withCredentials: false});
            return response.data;
        } catch (error) {
            console.error('Error:', error.message);
            if(error.response.status == 401){
                window.location.href = "/"
            }
            throw error;
        }
    },

    blobToBase64: async (blobUrl) => {
        try {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                resolve(reader.result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error:', error.message);
            return null;
        }
    }
};

export default ApiServiceHelper;