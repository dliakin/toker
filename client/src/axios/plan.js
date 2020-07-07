import axios from "axios";

var baseURL = 'http://localhost:5000/api/plan'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000/api/plan'
} else {
    baseURL = 'https://toker.team/api/plan'
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
    all: (params) =>
        instance({
            method: 'GET',
            url: `/`,
            params,

        }),
    checkPay: (token) =>
        instance({
            method: 'GET',
            url: '/checkPay',
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),

    get: (id, data, params) =>
        instance({
            method: 'POST',
            params,
            url: `/${id}`,
            data,
        }),
    getPayUrl: (id, params, token) =>
        instance({
            method: 'GET',
            url: `/getPayUrl/${id}`,
            params,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),
}