// src/lib/axiosClient.ts
import axios from 'axios';

// Utility to read a cookie value by name
function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

const axiosClient = axios.create({
    baseURL: 'http://localhost:6942/api',
    withCredentials: true, // Ensures cookies (like refresh token) are sent
});

// Add request interceptor
axiosClient.interceptors.request.use(
    config => {
        const token = getCookie('token'); // Replace with your JWT cookie name
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log("token: ", token)
        return config;
    },
    error => Promise.reject(error)
);

export default axiosClient;
