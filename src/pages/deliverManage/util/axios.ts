import axios from 'axios';
import { message } from 'tdesign-react';

//@ts-ignore
axios.defaults.headers["Content-Type"] = "application/json";

const baseUrl = 'http://9.135.146.67:8000/api_v1'
axios.defaults.timeout = 60 * 1000 * 2;
axios.defaults.baseURL = baseUrl
axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('sysauditor-token')

    if (!token) {
      // history.push('/login')
      window.location.href = 'http://' + window.location.host
    } else {
      //@ts-ignore
      config.headers.authorization = `Bearer ${token}`
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {

    return response;
  },
  error => {
    return Promise.resolve(error.response);
  }
);

function checkStatus(response: { status: number; data: any; }) {
  return new Promise((resolve, reject) => {
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
      if (response.data?.code === 308) {
        //跳转到登录
        window.location.href = window.location.origin + '/login';
      }
      resolve(response.data);
    } else {
      message.error({
        content: '网络异常，请检查网络连接是否正常！',
        duration: 2
      });
    }
  });
}
export default {
  post(url: string, params?: any) {
    return axios({
      method: "post",
      url,
      data: params
    }).then(response => {
      return checkStatus(response);
    });
  },
  get(url: string, params: any) {
    return axios({
      method: "get",
      url,
      params,
    }).then(response => {
      return checkStatus(response);
    });
  },


  postUpFile(url: string, params?: any,uploadProgress?:any) {
    return axios({
      headers: {'Content-Type': 'multipart/form-data'},
      method: "post",
      url,
      data: params,
      onUploadProgress:uploadProgress,
    }).then(response => {
      return checkStatus(response);
    }).catch((err:any)=>{
      return err
    });
  },

  downLoad(url: string, params?: any) {
    return axios({
      method: "post",
      url,
      responseType: 'blob',
      data: params
    }).then(response => {
      return checkStatus(response);
    });
  },
};