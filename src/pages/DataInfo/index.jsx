import React, { useEffect, useState } from 'react'
import {
  Button,
  Descriptions,
  Modal,
  Form,
  Input,
  notification,
  message,
} from 'antd'
import { useSearchParams } from 'react-router-dom'
import { http } from '../../utils'
import moment from 'moment'

const DataInfo = () => {
  const { TextArea } = Input
  const [dataInfo, setDataInfo] = useState(null)
  const [params] = useSearchParams()
  const id = params.get('id')
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/dataset/info?id=${id}`)
      const data = res.data.data
      setDataInfo(data)
    }
    if (id) {
      loadDetail()
    }
  }, [id])

  const items = [
    {
      key: '1',
      label: '数据集Id',
      children: id,
      span: 1.5,
    },
    {
      key: '2',
      label: '数据集名称',
      children: dataInfo ? dataInfo.dataName : '',
      span: 1.5,
    },
    {
      key: '3',
      label: '数据集来源',
      children: dataInfo ? dataInfo.dataUrl : '',
      span: 1.5,
    },
    {
      key: '4',
      label: '数据集文件数量',
      children: dataInfo ? dataInfo.filesSize : '',
      span: 1.5,
    },
    {
      key: '4',
      label: '创建时间',
      children: dataInfo
        ? moment(dataInfo.createTime).format('YYYY-MM-DD HH:mm:ss')
        : '',
      span: 2,
    },
    {
      key: '5',
      label: '创建用户',
      children: dataInfo ? dataInfo.createUser : '',
    },
    {
      key: '6',
      label: '更新时间',
      children: dataInfo
        ? moment(dataInfo.updateTime).format('YYYY-MM-DD HH:mm:ss')
        : '',
      span: 2,
    },
    {
      key: '7',
      label: '更新用户',
      children: dataInfo ? dataInfo.updateUser : '',
    },
    {
      key: '8',
      label: '创建年/月',
      children: dataInfo ? dataInfo.createMonth : '',
      span: 1,
    },
    {
      key: '9',
      label: '创建年/周',
      children: dataInfo ? dataInfo.createWeek : '',
      span: 1,
    },
    {
      key: '10',
      label: '创建年/月/日',
      children: dataInfo ? dataInfo.createDay : '',
      span: 1,
    },
    {
      key: '11',
      label: '数据集介绍',
      children: dataInfo ? dataInfo.dataInfo : '',
      span: 3,
    },
  ]
  //表单回调
  const [form] = Form.useForm()
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  }

  //修改操作
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification()
  const openNotification = (placement) => {
    api.info({
      message: '信息提示',
      description: '缺少id信息，无法更新，请稍后重试！',
      placement,
    })
  }
  const showModal = () => {
    if (dataInfo != null) {
      const updateInfo = () => {
        form.setFieldValue('dataName', dataInfo ? dataInfo.dataName : '')
        form.setFieldValue('dataUrl', dataInfo ? dataInfo.dataUrl : '')
        form.setFieldValue('dataInfo', dataInfo ? dataInfo.dataInfo : '')
      }
      if (dataInfo) {
        updateInfo()
      }
      setOpen(true)
    }
  }
  async function onFinish() {
    if (id) {
      const transData = {
        id: id,
        dataName: form.getFieldValue('dataName'),
        dataUrl: form.getFieldValue('dataUrl'),
        dataInfo: form.getFieldValue('dataInfo'),
      }
      console.log(transData)
      const response = await http.get('/dataset/update', { params: transData })
      const data = response.data.data
      console.log(response)
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
      setDataInfo(data)
      message.success('更新成功')
    }, 2000)
  }
  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }
  return (
    <div>
      {contextHolder}
      <Descriptions
        title="数据集详情"
        bordered
        items={items}
        extra={
          <Button type="primary" onClick={showModal}>
            修改
          </Button>
        }></Descriptions>
      <Modal
        title={dataInfo ? dataInfo.dataName : '文件修改'}
        open={open}
        onOk={onFinish}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}>
        <Form
          {...layout}
          name="control-ref"
          form={form}
          style={{ maxWidth: 600 }}>
          <Form.Item name="dataName" label="数据集名称">
            <Input disabled="true" />
          </Form.Item>
          <Form.Item name="dataUrl" label="数据集来源">
            <Input />
          </Form.Item>
          <Form.Item name="dataInfo" label="数据集介绍">
            <TextArea></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DataInfo
