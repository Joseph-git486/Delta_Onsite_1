import axios from 'axios';
import {getAccessToken, setAccessToken } from '../tokenStore';

const api = axios.create({
    baseURL: "http://localhost:5000"
});

api.interceptors.request.use(config => {
    const token = getAccessToken();
    if(token){
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if(error.response && error.response.status === 401){
            try{
                const res = await api.get('api/auth/refresh', {withCredentials: true});
                setAccessToken(res.data.accessToken);
                error.config.headers.authorization = `Bearer ${res.data.accessToken}`;
                return api(error.config)    // retry the req
            } catch(refreshErr) {
                setAccessToken(null);
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    }
)

export default api;