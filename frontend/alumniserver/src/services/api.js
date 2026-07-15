// src/services/api.js
import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

// Setup axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');
        if (!token) {
            const match = document.cookie.match(/(^| )token=([^;]+)/);
            if (match) token = decodeURIComponent(match[2]);
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);