import axios from 'axios';

// 创建 Axios 实例
const instance = axios.create({
    baseURL: 'http://127.0.0.1:8080/',
    timeout: 5000,
});

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
    response => {
        return Promise.resolve(response); 
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;
