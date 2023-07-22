import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  List,
  Skeleton,
  Badge,
  Drawer,
  message,
  Popconfirm,
} from 'antd'
import { useSearchParams } from 'react-router-dom'
import { http } from '../../utils'
import moment from 'moment'
import { values } from 'lodash'
import axios from 'axios'
import ReactJson from 'react-json-view'
const TaskFiles = () => {
  const [list, setList] = useState([])
  //获取任务id
  const [params] = useSearchParams()
  const id = params.get('id')
  const loadFiles = async () => {
    const res = await http.get(`/infosourcefile/findAll?id=${id}`)
    const data = res.data.data
    setList(data)
  }
  useEffect(() => {
    if (id) {
      loadFiles()
    }
  }, [id])
  // 文件内容
  const [openfileContent, setOpenFileContent] = useState(false)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const showFileContentDrawer = (data) => {
    console.log(data)
    setTitle(data.fileName)
    loadContent(data.id)
    setOpenFileContent(true)
  }
  const loadContent = async (id) => {
    const response = await http.get(`/infosourcefile/getContent?id=${id}`)
    debugger
    if (response.data.data) {
      setContent(response.data.data)
    }
  }
  const closeFileContentDrawer = () => {
    setOpenFileContent(false)
  }
  //删除文件
  const deleteFile = async (item) => {
    const response = await http.get(`/infosourcefile/deleteFile?id=${item.id}`)
    if (response.data.data) {
      message.success(response.data.msg)
      loadFiles()
    } else {
      message.error(response.data.msg)
    }
  }
  const cancel = (e) => {
    message.error('操作已取消')
  }
  //审核通过文件
  const onCheck = async (item) => {
    const response = await http.get(`/infosourcefile/checkFile?id=${item.id}`)
    if (response.data.data) {
      message.success(response.data.msg)
      loadFiles()
    } else {
      message.error(response.data.msg)
    }
  }
  return (
    <>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button disabled={item.status} onClick={() => onCheck(item)}>
                审核通过
              </Button>,
              <Button onClick={() => showFileContentDrawer(item)}>
                查看文件
              </Button>,
              <Popconfirm
                title="删除"
                description="是否要删除此文件"
                onConfirm={() => deleteFile(item)}
                onCancel={cancel}
                okText="是"
                cancelText="否">
                <Button danger>删除文件</Button>
              </Popconfirm>,
            ]}>
            <List.Item.Meta
              title={item.fileName}
              description={
                <div>
                  创建时间：
                  {moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  <br />
                  创建人：{item.createUser}
                </div>
              }
            />
            <>
              {item.status ? (
                <Badge status="success" text="已通过" />
              ) : (
                <Badge status="error" text="审核中" />
              )}
            </>
          </List.Item>
        )}
      />
      <Drawer
        title={title}
        placement="right"
        open={openfileContent}
        size="large"
        onClose={closeFileContentDrawer}>
        <pre>
          <code>{content}</code>
        </pre>
      </Drawer>
    </>
  )
}
export default TaskFiles
