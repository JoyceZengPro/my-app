import axios from 'axios'

// 创建axios实例
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5555/api',
    timeout: 10000,
    withCredentials: true // 若使用Session方案需开启
})

// 请求拦截器（添加认证头）
api.interceptors.request.use(config => {
    // 从localStorage获取JWT Token
    const token = localStorage.getItem('token')

    // 若存在token则添加到请求头
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器（统一错误处理）
api.interceptors.response.use(
    response => response.data, // 直接返回data字段
    error => {
        // 处理HTTP错误状态码
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('未授权，请重新登录')
                    window.location.href = '/login'
                    break
                case 403:
                    console.error('权限不足')
                    break
                case 500:
                    console.error('服务器内部错误')
                    break
                default:
                    console.error(`请求错误: ${error.message}`)
            }
        }
        return Promise.reject(error)
    }
)

export default api