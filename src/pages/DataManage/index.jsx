// 上传文件使用，需要填写文件的相关信息，然后有文件上传接口
import React, { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload, Form, Input, Layout } from 'antd'
import { http } from '../../utils'
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e
  }
  return e?.fileList
}

const DataManage = () => {
  const { Content } = Layout
  const { TextArea } = Input
  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)
  const [form] = Form.useForm()
  async function handleUpload(values) {
    const { dataName, dataSetInfo, dataSetUrl } = values
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('files', file)
    })
    formData.append('dataName', dataName)
    formData.append('dataSetUrl', dataSetUrl)
    formData.append('dataSetInfo', dataSetInfo)
    setUploading(true)
    // You can use any AJAX library you like
    try {
      const response = await http.post('/dataset/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(response)
      setFileList([])
      message.success('upload successfully.')
    } catch (error) {
      message.error('upload failed.')
    } finally {
      setUploading(false)
    }
  }
  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList((prevFileList) => [...prevFileList, file])
      return false
    },
    fileList,
    multiple: true,
  }
  const detectOnlyOne = async (dataName) => {
    const response = await http.get('/dataset/isNotExist', {
      params: { dataName },
    })
    const data = response.data.data
    console.log('响应内容：', data)
    return data
  }
  // 在组件中定义一个状态变量，用于存储校验状态
  const [validateStatus, setValidateStatus] = useState()
  return (
    <Layout>
      <Content>
        <Form
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          style={{
            maxWidth: 600,
          }}
          onFinish={handleUpload}
          validateTrigger={['onBlur']}>
          <Form.Item
            label="数据集名称"
            name="dataName"
            rules={[
              { required: true, message: '请输入数据集名称' },
              ({ getFieldValue }) => ({
                async validator(_, value) {
                  console.log('value:', value)
                  console.log('dataName:', getFieldValue('dataName'))
                  const res = await detectOnlyOne(getFieldValue('dataName'))
                  if (!res) {
                    return Promise.reject('数据集已存在')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
            validateStatus={validateStatus}
            hasFeedback>
            <Input />
          </Form.Item>
          <Form.Item label="数据集来源" name="dataSetUrl">
            <Input />
          </Form.Item>
          <Form.Item label="数据集介绍" name="dataSetInfo">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="文件"
            valuePropName="fileList"
            getValueFromEvent={normFile}>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            disabled={fileList.length === 0}
            loading={uploading}
            htmlType="submit"
            style={{
              marginTop: 16,
            }}>
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        </Form>
      </Content>
    </Layout>
  )
}

export default DataManage
