import React, { useState, useEffect } from 'react'
import {
  Layout,
  Button,
  Input,
  Table,
  Space,
  Drawer,
  Form,
  message,
  Pagination,
  Modal,
} from 'antd'
import './index.scss'
import { http } from '../../utils'
const { Header, Content } = Layout

const RelationManage = () => {
  const [isCreate, setIsCreate] = useState(true)
  //更新关系
  const onUpdate = (data) => {
    setIsCreate(false)
    console.log(data)
    form.setFieldValue('relationName', data.relationName)
    form.setFieldValue('description', data.description)
    form.setFieldValue('annotationName', data.annotationName)
    form.setFieldValue('id', data.key)
    showDrawer()
  }
  //删除关系类型
  const onRemove = (data) => {
    Modal.confirm({
      content: '删除实体类型',
      onOk: () => {
        goDeleteRelation(data)
      },
    })
  }
  const goDeleteRelation = async (data) => {
    const res = await http.get(`relation/deleteById?id=${data.key}`)
    if (res.status === 200) {
      message.info('删除成功')
      loadList('')
      // window.location.reload() // 刷新页面
    } else {
      message.error('删除失败')
    }
    //只要res是成功的，那么就刷新一次页面，失败则提示
  }
  //模糊查找
  // const searchRef = useRef(null)
  const onSearch = async (value) => {
    console.log(value)
    loadList(value)
  }
  const [pageParams, setPageParams] = useState({
    page: 1, //当前页
    per_page: 5, //每页多少
  })
  const { Search } = Input
  //信息展示
  useEffect(() => {
    loadList('')
  }, [pageParams])
  //关系类型参数管理,

  //关系类型列表管理 统一管理数据 将来修改给setRelation传对象
  const [relation, setRelation] = useState({
    list: [], //关系类型列表
    count: 0, //关系类型数量
  })
  const loadList = async (keyword) => {
    const transData = {
      page: pageParams.page,
      per_page: pageParams.per_page,
      keyword: keyword,
    }
    const res = await http.get('/relation/findall', { params: transData })
    if (res.data.data) {
      const { records, pages, size, total } = res.data.data
      console.log('record:', records)
      const relationInfoList = records.map((item, index) => ({
        key: item.id,
        number: (index + 1).toString(),
        relationName: item.relationName,
        annotationName: item.annotationName,
        description: item.description,
      }))
      setRelation({
        list: relationInfoList,
        count: total,
      })
    }
  }
  //新建，跳转新建页面
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState('right')
  const goNew = () => {
    setIsCreate(true)
    showDrawer()
  }
  const onClose = () => {
    form.setFieldValue('relationName', '')
    form.setFieldValue('annotationName', '')
    form.setFieldValue('description', '')
    setOpen(false)
  }
  const showDrawer = () => {
    setOpen(true)
  }
  const onFinish = async (values) => {
    const formData = new FormData()
    formData.append('relationName', values.relationName)
    formData.append('annotationName', values.annotationName)
    formData.append('description', values.description)
    if (isCreate) {
      const response = await http.post('/relation/insert', formData)
      if (response.data.data) {
        message.success('新建成功')
        onClose()
        loadList('')
      } else {
        message.error('新建失败')
      }
    } else {
      formData.append('id', values.id)
      const response = await http.post('/relation/update', formData)
      if (response.data.data) {
        message.success('更新成功')
        onClose()
        loadList('')
      } else {
        message.error('更新失败')
      }
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  //翻页设置
  const onChangePage = (page) => {
    console.log(page)
    setPageParams({
      ...pageParams,
      page: page,
    })
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '关系类型名称',
      dataIndex: 'relationName',
      key: 'relationName',
    },
    {
      title: '关系标注名称',
      dataIndex: 'annotationName',
      key: 'annotationName',
    },
    {
      title: '类型描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (data) => (
        <Space size="middle">
          <Button onClick={() => onUpdate(data)}>更新</Button>
          <Button danger onClick={() => onRemove(data)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
  //确保实体唯一性
  const detectOnlyOne = async (relationName) => {
    const response = await http.get('/relation/isNotExist', {
      params: { relationName },
    })
    const data = response.data.data
    console.log('响应内容：', data)
    return data
  }
  return (
    <div className="datatask">
      <Layout className="main" style={{ background: 'beige' }}>
        <Header className="header">
          <Button type="primary" onClick={goNew}>
            新建
          </Button>
          <Search
            className="search"
            placeholder="根据关系名称搜索"
            style={{
              width: 200,
            }}
            // ref={searchRef}
            onSearch={onSearch}
          />
        </Header>
        <Content className="tasklist">关系列表</Content>
        <Content className="content">
          <Table
            dataSource={relation.list}
            columns={columns}
            pagination={{ position: ['none', 'none'] }}
          />
          <Pagination
            current={pageParams.page}
            onChange={onChangePage}
            pageSize={pageParams.per_page}
            total={relation.count}
            hideOnSinglePage
          />
          <Drawer
            title={isCreate ? '新建关系类型' : '更新关系类型'}
            placement={placement}
            width={500}
            onClose={onClose}
            open={open}>
            {/* 内部展示 */}
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form}>
              <Form.Item label="id" name="id" hidden={isCreate}>
                <Input disabled></Input>
              </Form.Item>
              <Form.Item
                label="关系类型名称"
                name="relationName"
                rules={[
                  {
                    required: true,
                    message: '请输入关系类型名称!',
                  },
                  ({ getFieldValue }) => ({
                    async validator(_, value) {
                      console.log('是否重复测试value:', value)
                      console.log(
                        'relationName:',
                        getFieldValue('relationName')
                      )
                      const res = await detectOnlyOne(
                        getFieldValue('relationName')
                      )
                      if (!res) {
                        return Promise.reject('关系已存在')
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="关系标注名称"
                name="annotationName"
                rules={[
                  {
                    required: true,
                    message: '请输入关系标注名称!',
                  },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="关系类型简介"
                name="description"
                rules={[
                  {
                    required: true,
                    message: '请输入关系类型简介',
                  },
                ]}>
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}>
                <Button type="primary" htmlType="submit">
                  {isCreate ? '新建' : '更新'}操作
                </Button>
              </Form.Item>
            </Form>
            <></>
          </Drawer>
        </Content>
      </Layout>
    </div>
  )
}

export default RelationManage
