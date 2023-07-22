import { useEffect, useState } from 'react'
import {
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  notification,
  message,
  Space,
  Popconfirm,
} from 'antd'
import moment from 'moment'
import { http } from '../../utils'
import { useNavigate } from 'react-router-dom'

const bytesToSize = (bytes) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 B'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}
const FileInfo = ({ menuInfo }) => {
  const id = menuInfo.key
  const [fileInfo, setfileInfo] = useState(null)

  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get('/files/info', { params: { id } })
      const result = res.data.data
      setfileInfo(result)
    }
    loadDetail()
  }, [id])
  const items = fileInfo
    ? [
        {
          key: '1',
          label: 'ID',
          children: fileInfo.id,
          span: 1.5,
        },
        {
          key: '2',
          label: '所属数据集',
          children: fileInfo.folder,
          span: 1.5,
        },
        {
          key: '3',
          label: '文件名称',
          children: fileInfo.submittedFileName,
          span: 3,
        },
        {
          key: '4',
          label: '下载地址',
          children: fileInfo.url,
          span: 3,
        },
        {
          key: '5',
          label: '文件类型',
          children: fileInfo.ext,
        },
        {
          key: '6',
          label: '文件大小',
          children: bytesToSize(fileInfo.size),
        },
        {
          key: '7',
          label: '创建时间',
          children: fileInfo
            ? moment(fileInfo.createTime).format('YYYY-MM-DD HH:mm:ss')
            : '',
        },
        {
          key: '8',
          label: '创建用户',
          children: fileInfo.createUser,
        },
        {
          key: '9',
          label: '更新时间',
          children: fileInfo
            ? moment(fileInfo.updateTime).format('YYYY-MM-DD HH:mm:ss')
            : '',
        },
        {
          key: '10',
          label: '更新用户',
          children: fileInfo.updateUser,
        },
      ]
    : []
  //表单回调和修改
  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  }
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }
  const showModal = () => {
    if (fileInfo != null) {
      const updateInfo = () => {
        form.setFieldValue(
          'submittedFileName',
          fileInfo ? fileInfo.submittedFileName : ''
        )
      }
      if (fileInfo) {
        updateInfo()
      }
      setOpen(true)
    }
  }
  async function onFinish() {
    if (id) {
      const transData = {
        id: id,
        submittedFileName: form.getFieldValue('submittedFileName'),
      }
      console.log(transData)
      const response = await http.get('/files/update', { params: transData })
      const data = response.data.data
      console.log(data)
      handleOk(data)
    } else {
      openNotification('top')
    }
  }
  const handleOk = (data) => {
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
      setfileInfo(data)
      message.success('更新成功')
    }, 2000)
  }
  //id缺少通知
  const openNotification = (placement) => {
    api.info({
      message: '信息提示',
      description: '缺少id信息，无法更新，请稍后重试！',
      placement,
    })
  }
  //文件下载
  async function onDown(id) {
    try {
      const response = await http.get('/files/download', {
        params: { id },
        responseType: 'blob',
      })

      const blob = new Blob([response.data], {
        type: 'application/octet-stream',
      })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${fileInfo.submittedFileName}`) // Set the desired file name
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
    }
  }
  //文件删除
  async function onDelete(id) {
    const response = await http.get('/files/delete', { params: { id } })

    if (response.status === 200) {
      window.location.reload()
      message.info('删除成功')
    } else {
      message.error('删除失败')
    }
  }
  const cancel = (e) => {
    message.error('操作已取消')
  }
  //查看文件详情
  const navigate = useNavigate()
  const goDetail = (id) => {
    navigate(`/files/filesdetail?id=${id}`)
  }
  return (
    <div>
      {contextHolder}
      <Descriptions
        title="文件详情"
        bordered
        items={items}
        extra={
          <Space>
            <Button onClick={() => goDetail(id)}>文件详情</Button>
            <Button type="primary" onClick={showModal}>
              修改
            </Button>
            <Button type="primary" onClick={() => onDown(id)}>
              下载
            </Button>
            <Popconfirm
              title="删除"
              description="是否要删除此文件？"
              onConfirm={() => onDelete(id)}
              onCancel={cancel}
              okText="是"
              cancelText="否">
              <Button type="primary">删除</Button>
            </Popconfirm>
          </Space>
        }
      />
      <Modal
        title={fileInfo ? fileInfo.submittedFileName : '文件修改'}
        open={open}
        onOk={onFinish}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}>
        <Form
          {...layout}
          name="control-ref"
          form={form}
          style={{ maxWidth: 600 }}>
          <Form.Item name="submittedFileName" label="文件名称">
            <Input />
          </Form.Item>
          <Form.Item></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FileInfo
