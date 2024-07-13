import axios, { AxiosResponse } from 'axios';

interface UploadResponse {
    url: string;
}

const API_URL = 'http://localhost:3001'; // Fallback to a default URL

export const uploadImage = async (imageBlob: Blob): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', imageBlob); 

        try {
                const response: AxiosResponse<UploadResponse> = await axios.post(`${API_URL}/api/s3/upload`, formData); 
                return response.data; // Contains URL or other response info
        } catch (error) {
                console.error('Error uploading file:', error);
                throw error; // Optionally re-throw for further handling
        }
};
