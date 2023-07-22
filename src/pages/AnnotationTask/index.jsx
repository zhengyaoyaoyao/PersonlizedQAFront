import React, { useState } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Layout, Menu, Button, theme } from 'antd'
const { Header, Sider, Content } = Layout

function getItem(label, key, children) {
  return {
    key,
    children,
    label,
  }
}
const AnnotationTask = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const items = [
    getItem('一标文件', '1', [
      getItem('Tom', '4'),
      getItem('Bill', '5'),
      getItem('Alex', '6'),
    ]),
    getItem('二标文件', '2', [
      getItem('Tom', '7'),
      getItem('Bill', '8'),
      getItem('Alex', '9'),
    ]),
    getItem('三标文件', '3', [
      getItem('Tom', '10'),
      getItem('Bill', '11'),
      getItem('Alex', '12'),
    ]),
  ]
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%' }}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}>
          Content
        </Content>
      </Layout>
    </Layout>
  )
}

export default AnnotationTask
