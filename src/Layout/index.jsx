import React, { useEffect, useMemo, useState } from 'react'
import './index.scss'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { Layout, Menu, theme, Popconfirm, Space, Button } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { InnerRouters } from '../routes/index'
import { observer } from 'mobx-react-lite'
import { usePageRoutes } from '../routes/pageRoutes'

const { Header, Content, Sider } = Layout

const setMenuKeys = (paths, end) => `/${paths.slice(0, end).join('/')}`

const DataLayout = () => {
  const { userStore, loginStore } = useStore()

  const location = useLocation()
  const { menuRoutes } = usePageRoutes()
  const [openKeys, setOpenKeys] = useState()

  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const { init } = userStore

  useEffect(() => {
    userStore.getUserInfo()
  }, [userStore])

  //确认退出
  const navigate = useNavigate()
  const onConfirm = () => {
    // 退出登录 删除token 跳回到登录
    loginStore.loginOut()
    navigate('/login')
  }

  const getItem = (label, key, icon, children, type) => {
    return {
      key,
      icon,
      children,
      label,
      type,
    }
  }

  const renderItems = (menuList) => {
    return menuList.map((menu) => {
      // const hasSubMenu = menu.subRoute?.length > 0
      const Icon = menu.icon
      const icon = Icon ? Icon : null
      if (menu.hideMenu) {
        return null
      }
      return getItem(menu.title, menu.path, icon)
    })
  }

  const onOpenChange = (keys) => {
    setOpenKeys(keys)
  }

  const onClick = (path) => {
    navigate(path[0])
  }

  const selectedKeys = useMemo(() => {
    const { pathname } = location
    const pathList = pathname.split('/').filter((p) => p)
    const realMenus = menuRoutes ?? []
    if (realMenus.length > 0) {
      const openKeys = setMenuKeys(pathList, 1)
      return openKeys
    }
    return pathList
  }, [menuRoutes])
  return (
    init && (
      <Layout>
        <Header className="header-container">
          <div className="title">数据采集平台</div>
          <div className="userInfo">
            <Space>
              <div>
                <UserOutlined />
              </div>
              <Space size={'middle'}>
                <span>用户:{userStore.userInfo.nickName}</span>
                <span className="outlogin">
                  <Popconfirm
                    onConfirm={onConfirm}
                    title="是否确认退出？"
                    okText="退出"
                    cancelText="取消">
                    <LogoutOutlined /> 退出
                  </Popconfirm>
                </span>
              </Space>
            </Space>
          </div>
        </Header>
        <Layout>
          <Sider className="sider">
            <Menu
              className="menu"
              mode="inline"
              theme="light"
              openKeys={openKeys}
              selectedKeys={selectedKeys}
              onOpenChange={onOpenChange}
              items={renderItems(menuRoutes)}
              onClick={({ item, key, keyPath }) => onClick(keyPath)}></Menu>
          </Sider>
          <Content>
            <InnerRouters />
          </Content>
        </Layout>
      </Layout>
    )
  )
}
export default observer(DataLayout)
