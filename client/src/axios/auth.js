import axios from "axios"

var baseURL = 'http://localhost:5000/api/auth'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000/api/auth'
} else {
    baseURL = 'https://toker.team/api/auth'
}

const instance = axios.create({
    baseURL,
});

instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default {
    register: (data) =>
        instance({
            method: 'POST',
            url: '/register',
            data
        }),
    reset_password: (data) =>
        instance({
            method: 'POST',
            url: '/reset_password',
            data
        }),

    login: (data) =>
        instance({
            method: 'POST',
            url: '/login',
            data
        }),

    updateUserData: (data, token) =>
        instance({
            method: 'POST',
            url: '/updateUserData',
            data,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),

    loadUserData: (token) =>
        instance({
            method: 'GET',
            url: '/loadUserData',
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),

    setDefaultAccauntId: (data, token) =>
        instance({
            method: 'POST',
            url: '/setDefaultAccauntId',
            data,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),
}