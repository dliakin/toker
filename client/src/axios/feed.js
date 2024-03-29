import axios from "axios";

var baseURL = 'http://localhost:5000/api/feed'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000/api/feed'
} else {
    baseURL = 'https://toker.team/api/feed'
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
    return Promise.reject(error)
});

export default {
    all: (token) =>
        instance({
            method: 'GET',
            url: `/`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),
    get: (id, token) =>
        instance({
            method: 'GET',
            url: `/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),
}