import axios, { AxiosResponse } from 'axios';

interface UploadResponse {
    url: string;
}

const API_URL = (window.location.hostname === 'localhost') ? 'http://localhost:3001' : 'https://v1-designscout.onrender.com'; 

export const uploadImage = async (imageBlob: Blob): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', imageBlob);
    
        try {
            const response: AxiosResponse<UploadResponse> = await axios({
                method: 'post',
                url: `${API_URL}/api/s3/upload`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };
    
