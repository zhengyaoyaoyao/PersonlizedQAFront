import React, { useEffect, useState } from 'react'
import { Menu, Layout } from 'antd'
import { http } from '../../utils'
import './index.scss'
import FileInfo from '../FileInfo'
import { Routes, Route } from 'react-router-dom'
const { Sider, Content } = Layout
function getItem(label, key, children, type) {
  return {
    label,
    key,
    children,
    type,
  }
}

// submenu keys of first level
const Files = () => {
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState(['sub1'])
  const [filesinfo, setFilesInfo] = useState([])
  const [items, setItems] = useState([])
  useEffect(() => {
    const loadFiles = async () => {
      const res = await http.get('/files/findall')
      const result = res.data.data.datas
      setFilesInfo(result)
    }
    loadFiles()
  }, [])
  useEffect(() => {
    if (filesinfo.length > 0) {
      generateNavigation()
    }
  }, [filesinfo])
  const generateNavigation = () => {
    const navigationItems = {}

    filesinfo.forEach((fi) => {
      if (!navigationItems[fi.folder]) {
        navigationItems[fi.folder] = []
      }
      navigationItems[fi.folder].push(fi)
    })
    const menuKeys = Object.keys(navigationItems).map(
      (item, index) => `sub${index + 1}`
    )
    setRootSubmenuKeys(menuKeys)
    const newItems = Object.keys(navigationItems).map((folder, index) => {
      return getItem(
        folder,
        `sub${index + 1}`,
        navigationItems[folder].map((fi) =>
          getItem(fi.submittedFileName, fi.id)
        )
      )
    })
    setItems(newItems)
  }
  const [openKeys, setOpenKeys] = useState([''])
  const onOpenChange = (keys) => {
    console.log('keys:' + keys)
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys) //展开主菜单
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  const [selectedMenuInfo, setSelectedMenuInfo] = useState(null)
  const onMenuClick = (menuInfo) => {
    setSelectedMenuInfo(menuInfo)
  }
  return (
    <Layout className="main">
      <Layout hasSider>
        <Sider className="siderStyle">
          <Menu
            className="menuStyle"
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onClick={onMenuClick}
            items={items}
          />
        </Sider>
        <Content className="contentStyle">
          <Routes>
            <Route path="/*" element={<>111</>}></Route>
          </Routes>
          {selectedMenuInfo ? (
            <FileInfo menuInfo={selectedMenuInfo} />
          ) : (
            <div>Select a menu item to display content.</div>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}
export default Files
