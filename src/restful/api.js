import Axios from 'axios'
import store from '../store'
import { Message, MessageBox } from 'element-ui'
import md5 from 'js-md5';

Axios.defaults.baseURL = 'http://192.168.1.224:8088/api/v1';
// Axios.defaults.baseURL = 'http://' + window.location.host +'/api/v1';
Axios.defaults.timeout = 3000
const loginUrl = '/login'
const siteUrl = '/site'
const ftpUrl = '/ftp'
const mysqlUrl = '/mysql'
const homelUrl = '/home'
const softUrl = '/soft'
const sslUrl = '/ssl'
const userUrl = '/user'

Axios.interceptors.request.use(function (config) {
    let username = localStorage.getItem('username')
    let token = localStorage.getItem('token')
    if (username && token) {
        let otime = Math.round(new Date().getTime() / 1000);
        config.headers.otime = otime;
        config.headers.username = username;
        config.headers.accesstoken = md5(username + otime.toString() + token)
    }
    return config;
}, function (error) {
    Message.error({ message: '请求超时!' });
    // return Promise.resolve(error);
});

Axios.interceptors.response.use(function (response) {
    if (response.data.errcode == 4023 || response.data.errcode == 4024 || response.data.errcode == 4026) {
        MessageBox.alert("你已被登出,请重新登录", "重新登录", {
            confirmButtonText: "确定",
            callback: action => {
                store.dispatch("accountLogout").then(() => {
                    localStorage.clear();
                    location.reload();
                });
            }
        });
    }
    return response;
}, function (error) {
    if (error.response.status == 400 || error.response.status == 422) {
        Message.error({ message: error.response.data.errmsg });
    } else {
        Message.error({ message: '未知错误!' });
    }
    // return Promise.resolve(error);
});

export function login (params) {
    return Axios.post(loginUrl, params).then(res => res.data)
}
export function logout (params) {
    return Axios.post(loginUrl, params).then(res => res.data)
}

export function getsite (params) {
    return Axios.get(siteUrl, { params: params }).then(res => res.data)
}

export function delsite (params) {
    return Axios.delete(siteUrl, { data: params }).then(res => res.data)
}

export function addsite (params) {
    return Axios.post(siteUrl, params).then(res => res.data)
}

export function upsite (params) {
    return Axios.put(siteUrl, params).then(res => res.data)
}

export function getftp (params) {
    return Axios.get(ftpUrl, { params: params }).then(res => res.data)
}

export function addftp (params) {
    return Axios.post(ftpUrl, params).then(res => res.data)
}

export function delftp (params) {
    return Axios.delete(ftpUrl, { data: params }).then(res => res.data)
}

export function upftp (params) {
    return Axios.put(ftpUrl, params).then(res => res.data)
}

export function getmysql (params) {
    return Axios.get(mysqlUrl, { params: params }).then(res => res.data)
}

export function addmysql (params) {
    return Axios.post(mysqlUrl, params).then(res => res.data)
}

export function delmysql (params) {
    return Axios.delete(mysqlUrl, { data: params }).then(res => res.data)
}

export function upmysql (params) {
    return Axios.put(mysqlUrl, params).then(res => res.data)
}

export function gethome (info) {
    return Axios.get(`${homelUrl}?info=${info}`).then(res => res.data)
}

export function getsoft (params) {
    return Axios.get(softUrl, { params: params }).then(res => res.data)
}

export function upsoft (params) {
    return Axios.put(softUrl, params).then(res => res.data)
}

export function addssl (formData) {
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    return Axios.post(sslUrl, formData, config).then(res => res.data)
}

export function changepwd (params) {
    return Axios.post(userUrl, params).then(res => res.data)
}