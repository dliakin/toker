import axios from "axios";

var baseURL = 'http://localhost:5000/api/accaunt'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000/api/accaunt'
} else {
    baseURL = 'https://toker.team/api/accaunt'
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
    find: (username) =>
        instance({
            method: 'GET',
            url: `/find/${username}`
        }),

    all: (token) =>
        instance({
            method: 'GET',
            url: `/`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),

    add: (data, token) =>
        instance({
            method: 'POST',
            url: '/add',
            data,
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

    setGoal: (data, token) =>
        instance({
            method: 'POST',
            url: '/setGoal',
            data,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),
        
    delete: (id, token) =>
        instance({
            method: 'DELETE',
            url: `/delete/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }),
}
