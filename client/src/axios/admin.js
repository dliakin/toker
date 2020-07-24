import axios from "axios";

var baseURL = 'http://localhost:5000/api/admin'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000/api/admin'
} else {
    baseURL = 'https://toker.team/api/admin'
}

const instance = axios.create({
    baseURL,
})

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
    dashboard: (token) =>
        instance({
            method: 'GET',
            url: `/dashboard`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),
    pays: (token) =>
        instance({
            method: 'GET',
            url: `/pays`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),
}