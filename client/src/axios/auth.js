import axios from "axios"

const instance = axios.create({
    baseURL: 'http://localhost:5000/api/auth',
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

}