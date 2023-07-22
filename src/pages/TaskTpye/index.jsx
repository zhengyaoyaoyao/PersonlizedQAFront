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

const TaskType = () => {
  const [isCreate, setIsCreate] = useState(true)
  //更新任务
  const onOpdate = (data) => {
    setIsCreate(false)
    console.log(data)
    form.setFieldValue('taskname', data.name)
    form.setFieldValue('description', data.description)
    form.setFieldValue('id', data.key)
    showDrawer()
  }
  //删除任务类型
  const onRemove = (data) => {
    Modal.confirm({
      content: '删除任务类型',
      onOk: () => {
        goDeleteTaskType(data)
      },
    })
  }
  const goDeleteTaskType = async (data) => {
    const res = await http.get(`tasktype/deleteById?id=${data.key}`)
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
  //任务类型参数管理,

  //任务类型列表管理 统一管理数据 将来修改给setTaskType传对象
  const [taskType, setTaskType] = useState({
    list: [], //任务类型列表
    count: 0, //任务类型数量
  })
  const loadList = async (keyword) => {
    const transData = {
      page: pageParams.page,
      per_page: pageParams.per_page,
      keyword: keyword,
    }
    const res = await http.get('/tasktype/findall', { params: transData })
    if (res.data.data) {
      const { records, total } = res.data.data
      console.log('record:', records)
      const taskTypeInfoList = records.map((item, index) => ({
        key: item.id,
        number: (index + 1).toString(),
        name: item.typeName,
        description: item.typeDesc,
      }))
      setTaskType({
        list: taskTypeInfoList,
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
    form.setFieldValue('taskname', '')
    form.setFieldValue('description', '')
    setOpen(false)
  }
  const showDrawer = () => {
    setOpen(true)
  }
  const onFinish = async (values) => {
    const formData = new FormData()
    formData.append('taskname', values.taskname)
    formData.append('description', values.description)
    if (isCreate) {
      const response = await http.post('/tasktype/insert', formData)
      if (response.data.data) {
        message.success('新建成功')
        onClose()
        loadList('')
      } else {
        message.error('新建失败')
      }
    } else {
      formData.append('id', values.id)
      const response = await http.post('/tasktype/update', formData)
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
      title: '标注类型名称',
      dataIndex: 'name',
      key: 'name',
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
          <Button onClick={() => onOpdate(data)}>更新</Button>
          <Button danger onClick={() => onRemove(data)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <div className="datatask">
      <Layout className="main" style={{ background: 'beige' }}>
        <Header className="header">
          <Button type="primary" onClick={goNew}>
            新建
          </Button>
          <Search
            className="search"
            placeholder="根据任务类型名称搜索"
            style={{
              width: 200,
            }}
            // ref={searchRef}
            onSearch={onSearch}
          />
        </Header>
        <Content className="tasklist">可选择任务类型</Content>
        <Content className="content">
          <Table
            dataSource={taskType.list}
            columns={columns}
            pagination={{ position: ['none', 'none'] }}
          />
          <Pagination
            current={pageParams.page}
            onChange={onChangePage}
            pageSize={pageParams.per_page}
            total={taskType.count}
            hideOnSinglePage
          />
          <Drawer
            title={isCreate ? '新建任务类型' : '更新任务类型'}
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
                label="任务类型名称"
                name="taskname"
                rules={[
                  {
                    required: true,
                    message: '请输入任务类型名称!',
                  },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="任务类型简介"
                name="description"
                rules={[
                  {
                    required: true,
                    message: '请输入任务类型简介',
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

export default TaskType
