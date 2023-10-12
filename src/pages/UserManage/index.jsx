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
  Badge,
  Switch,
} from 'antd'
import './index.scss'
import moment from 'moment'
import { http } from '../../utils'
const { Header, Content } = Layout
const UserManage = () => {
  const [isCreate, setIsCreate] = useState(true)
  //更新成员

  //根据id查询用户

  const searchUserById = async (id) => {
    const res = await http.get(`/user/searchUserById?id=${id}`)
    return res.data.data
  }
  const onUpdate = (data) => {
    setIsCreate(false)
    console.log(data)
    searchUserById(data.key)
      .then((user) => {
        if (user) {
          form.setFields([
            {
              name: 'username',
              errors: [],
            },
            {
              name: 'phone',
              errors: [],
            },
            {
              name: 'password',
              errors: [],
            },
            {
              name: 'nickName',
              errors: [],
            },
            {
              name: 'organization',
              errors: [],
            },
            {
              name: 'authority',
              errors: [],
            },
          ])
          console.log('获取的用户信息', user)
          form.setFieldValue('id', data.key)
          form.setFieldValue('username', data.username)
          form.setFieldValue('phone', data.phone)
          form.setFieldValue('password', user.password)
          form.setFieldValue('organization', data.organization)
          form.setFieldValue('authority', data.authority)
          form.setFieldValue('nickName', data.nickName)
          form.setFieldValue('status', data.status)
          showDrawer()
        }
      })
      .catch((error) => {
        console.log('获取信息失败', error)
      })
  }
  //模糊查找
  // const searchRef = useRef(null)
  const onSearch = async (value) => {
    console.log(value)
    loadList(value)
  }
  const [pageParams, setPageParams] = useState({
    page: 1, //当前页
    per_page: 10, //每页多少
  })
  const { Search } = Input
  //信息展示
  useEffect(() => {
    loadList('')
  }, [pageParams])
  const [users, setUsers] = useState({
    list: [], //用户列表
    count: 0, //用户数量
  })
  //加载用户
  const loadList = async (keyword) => {
    const transData = {
      page: pageParams.page,
      per_page: pageParams.per_page,
      keyword: keyword,
    }
    const res = await http.get('/user/findall', { params: transData })
    if (res.data.data) {
      const { records, total } = res.data.data
      console.log('record:', records)
      const userInfoList = records.map((item, index) => ({
        key: item.id,
        number: (index + 1).toString(),
        userCode: item.userCode,
        username: item.username,
        nickName: item.nickName,
        authority: item.authority,
        organization: item.organization,
        phone: item.phone,
        createTime: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
        loginTime: item.loginTime
          ? moment(item.loginTime).format('YYYY-MM-DD HH:mm:ss')
          : '未登录',
        loginIP: item.loginIp ? item.loginIp : '未登录',
        status: item.status,
      }))
      setUsers({
        list: userInfoList,
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
    form.setFieldValue('username', '')
    form.setFieldValue('phone', '')
    form.setFieldValue('password', '')
    form.setFieldValue('organization', '')
    form.setFieldValue('authority', '')
    form.setFieldValue('nickName', '')
    form.setFieldValue('status', '')
    setOpen(false)
  }
  const showDrawer = () => {
    setOpen(true)
  }
  const onFinish = async (values) => {
    console.log(values)
    const formData = new FormData()
    formData.append('username', values.username)
    formData.append('nickName', values.nickName)
    formData.append('phone', values.phone)
    formData.append('password', values.password)
    formData.append('organization', values.organization)
    formData.append('authority', values.authority)
    formData.append(
      'status',
      values.status !== undefined ? values.status : false
    )
    if (isCreate) {
      const response = await http.post('/user/insert', formData)
      if (response.data.data) {
        message.success('新建成功')
        onClose()
        loadList('')
      } else {
        message.error('新建失败')
      }
    } else {
      formData.append('id', values.id)
      const response = await http.post('/user/update', formData)
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
  //删除用户
  const onDelete = async (data) => {
    const id = data.key
    Modal.confirm({
      content: '删除用户类型',
      onOk: () => {
        goDeleteUser(id)
      },
    })
  }
  const goDeleteUser = async (id) => {
    const res = await http.get(`/user/deleteById?id=${id}`)
    if (res.status === 200) {
      message.info('删除成功')
      loadList('')
      // window.location.reload() // 刷新页面
    } else {
      message.error('删除失败')
    }
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '用户名称',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户代号',
      dataIndex: 'userCode',
      key: 'userCode',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: '权限',
      dataIndex: 'authority',
      key: 'authority',
    },
    {
      title: '所属组织',
      dataIndex: 'organization',
      key: 'organization',
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '最后登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
    },
    {
      title: '登录ip',
      dataIndex: 'loginIP',
      key: 'loginIP',
    },
    {
      title: '账户状态',
      dataIndex: 'status',
      key: 'status',
      render: (data) => {
        const status = data
        return status ? (
          <Badge status="success" text="正常" />
        ) : (
          <Badge status="error" text="禁用" />
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (data) => (
        <Space size="middle">
          <Button onClick={() => onDelete(data)} danger>
            删除
          </Button>
          <Button onClick={() => onUpdate(data)}>更新</Button>
        </Space>
      ),
    },
  ]
  //确保用户名唯一性
  const detectOnlyOne = async (username) => {
    const response = await http.get('/user/isNotExist', {
      params: { username },
    })
    const data = response.data.data
    console.log('响应内容：', data)
    return data
  }
  return (
    <div className="datatask">
      <Layout className="main" style={{ background: 'beige' }}>
        <div style={{ background: 'white' }}>
          <Content className="tasklist">成员管理</Content>
        </div>
        <Header className="header">
          <Search
            className="search"
            placeholder="根据用户名搜索"
            onSearch={onSearch}
          />
          <Button className="new" type="primary" onClick={goNew}>
            新建
          </Button>
        </Header>

        <Content className="content">
          <Table
            dataSource={users.list}
            columns={columns}
            pagination={{ position: ['none', 'none'] }}
          />
          <Pagination
            current={pageParams.page}
            onChange={onChangePage}
            pageSize={pageParams.per_page}
            total={users.count}
            hideOnSinglePage
          />
          <Drawer
            title={isCreate ? '新建用户' : '更新用户信息'}
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
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form}>
              <Form.Item label="id" name="id" hidden={isCreate}>
                <Input disabled></Input>
              </Form.Item>
              <Form.Item
                label="用户名"
                name="username"
                rules={
                  isCreate
                    ? [
                        {
                          required: true,
                          message: '请输入用户名!',
                        },
                        ({ getFieldValue }) => ({
                          async validator(_, value) {
                            console.log('是否重复测试value:', value)
                            console.log('username:', getFieldValue('username'))
                            const res = await detectOnlyOne(
                              getFieldValue('username')
                            )
                            if (!res) {
                              return Promise.reject('用户已存在')
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]
                    : []
                }>
                <Input disabled={!isCreate} />
              </Form.Item>
              <Form.Item
                label="电话号码"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: '请输入电话号码!',
                  },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="所属组织"
                name="organization"
                rules={[
                  {
                    required: true,
                    message: '请输入所属组织',
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item label="昵称" name="nickName">
                <Input />
              </Form.Item>
              <Form.Item
                label="权限"
                name="authority"
                rules={[
                  {
                    required: true,
                    message: '请填写所属权限',
                  },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item label="状态" name="status" valuePropName="checked">
                <Switch />
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
export default UserManage
