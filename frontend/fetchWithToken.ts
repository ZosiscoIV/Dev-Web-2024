// app/fetchWithToken.ts
import axios from 'axios'

// 1) Create an instance
const axiosClient = axios.create({
    baseURL: 'http://localhost:6942/api',
    headers: { 'Content-Type': 'application/json' },
})

// 2) Request interceptor: add Bearer token
axiosClient.interceptors.request.use(
    config => {
        // Read token from where you’re persisting it:
        // • cookie, localStorage, or a React context, etc.
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1]

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        console.log(config.headers.Authorization)
        return config
    },
    error => Promise.reject(error)
)
export default axiosClient
