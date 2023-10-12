import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons'
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components'
import { message, Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './index.scss'
import { useStore } from '../../store/index'
import { usePageRoutes } from '../../routes/pageRoutes'
import logo from '../../assets/Octocat.png'
const Login = () => {
  const navigate = useNavigate()
  const { menuRoutes } = usePageRoutes()
  const [loginType, setLoginType] = useState('account')
  const { loginStore } = useStore()
  async function onFinish(values) {
    console.log(values)
    const { username, password } = values
    const loginResult = await loginStore.getToken({ username, password })
    if (loginResult.success) {
      navigate(menuRoutes[0]?.path ?? '/home', { repalce: true })
      message.success(loginResult.message)
    } else {
      message.error(loginResult.message)
    }
  }
  const forgetPassword = () => {
    message.error('请联系管理员')
  }
  return (
    <div className="loginContainer">
      <ProConfigProvider hashed={false}>
        <div>
          <LoginForm
            logo={logo}
            title="数据采集平台"
            subTitle="个性化问答数据、模型仓库"
            onFinish={onFinish}>
            <Tabs
              centered
              activeKey={loginType}
              onChange={(activeKey) => setLoginType(activeKey)}>
              <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
              {/* <Tabs.TabPane key={'phone'} tab={'手机号登录'} /> */}
            </Tabs>
            {loginType === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={'prefixIcon'} />,
                  }}
                  placeholder={'用户名'}
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                  }}
                  placeholder={'密码'}
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                />
              </>
            )}
            {loginType === 'phone' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className={'prefixIcon'} />,
                  }}
                  name="mobile"
                  placeholder={'手机号'}
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={'请输入验证码'}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${'获取验证码'}`
                    }
                    return '获取验证码'
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                  onGetCaptcha={async () => {
                    message.success('获取验证码成功！验证码为：1234')
                  }}
                />
              </>
            )}
            <div
              style={{
                marginBlockEnd: 24,
              }}>
              {/* <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox> */}
              <a
                style={{
                  float: 'right',
                }}
                onClick={forgetPassword}>
                忘记密码
              </a>
            </div>
          </LoginForm>
        </div>
      </ProConfigProvider>
    </div>
  )
}

export default Login
