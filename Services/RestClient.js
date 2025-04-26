import axios from "axios";
let headers = {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
    "Access-Token": ""
}
axios.interceptors.request.use(
    (config) => {
        document.getElementById("loader").style.display="block";
return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        document.getElementById("loader").style.display="none";
        return response;
    },
    (error) => {
        document.getElementById("loader").style.display="none";
        return Promise.reject(error);
    }
);

export const getRequest = (url) => {
    return new Promise((res, rej) => {
        axios({
            method: 'GET',
            baseURL: process.env.BASE_URL,
            url,
            headers
        }).then((response) => {
            res(response?.data);
        }).catch((error) => {
            rej(error);
        });
    })
}

export const postRequest = (url, data) => {
    return new Promise((res, rej) => {
        axios({
            method: 'POST',
            baseURL: process.env.BASE_URL,
            url,
            data,
            headers
        }).then((response) => {
            res(response?.data);
        }).catch((error) => {
            rej(error);
        });
    })
}

export const deleteRequest = (url) => {
    return new Promise((res, rej) => {
        axios({
            method: 'DELETE',
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url,
            headers
        }).then((response) => {
            res(response?.data);
        }).catch((error) => {
            rej(error);
        });
    })
}