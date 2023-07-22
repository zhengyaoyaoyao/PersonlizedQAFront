// login module
import { makeAutoObservable } from 'mobx'
import { http, setToken, getToken, removeToken } from '../utils'
import { message } from 'antd'
class LoginStore {
  token = getToken() || ''
  constructor() {
    // 响应式
    makeAutoObservable(this)
  }
  getToken = async ({ username, password }) => {
    const loginForm = {
      username: username,
      password: password,
    }
    // 调用登录接口
    const response = await http.post(
      '/user/login',
      loginForm
    )
    const resultData = response.data
    if (resultData) {
      //此时成功发送请求，并收到响应
      if (resultData.code === -10) {
        return { success: false, message: resultData.msg }
      } else {
        console.log('登录的token:', resultData.data)
        // 存入token
        this.token = resultData.data
        setToken(this.token)
        return { success: true, message: resultData.msg }
      }
    } else {
      // message.error('登录失败')
      return { success: false, message: resultData.msg }
    }
  }
  // 退出登录
  loginOut = () => {
    this.token = ''
    removeToken()
  }
}

export default LoginStore
