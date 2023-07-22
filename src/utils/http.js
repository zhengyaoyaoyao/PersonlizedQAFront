//封装axios
//实例化 请求拦截器 响应拦截器

import axios from "axios"
import { getToken } from "./index"
import { message } from "antd"

const http = axios.create({
  baseURL: 'http://192.168.0.108:9090',
  timeout: 10000
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
}, (error) => {
  console.log("错误信息:", error)
  return Promise.reject(error)
})
http.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      // message.success(response.data.msg)
    } else if (response.status === 401) {
      console.log("成功的401响应")
    }
    return response
  }, (error) => {
    if (error.response && error.response.status === 401) {
      message.error("请登录后再试")
      window.location.href = '/login'
      console.log("失败的401响应")
    }
    return Promise.reject(error)
  }
)
export { http }