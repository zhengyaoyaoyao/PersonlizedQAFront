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
  Descriptions,
  Modal,
} from 'antd'
import './index.scss'
import moment from 'moment'
import { http } from '../../utils'
import JSONEditorReact from '../../components/JSONEditorReact'

import { checkFunction } from '../../utils/authFunction'
const { Header, Content } = Layout
const InfoSource = () => {
  const [isCreate, setIsCreate] = useState(true)
  //控制上传按钮
  const [isValidate, setIsValidate] = useState(false)
  //更新信源
  const onUpdate = (data) => {
    setIsCreate(false)
    console.log(data)

    form.setFieldValue('infoSourceName', data.infoSourceName)
    form.setFieldValue('infoSourceUrl', data.infoSourceUrl)
    let infoSourceRuleJSON = {}
    try {
      infoSourceRuleJSON = JSON.parse(data.infoSourceRule)
    } catch (error) {
      infoSourceRuleJSON = { errorFormat: data.infoSourceRule }
      console.error(error)
    }
    setJsonContent({
      json: infoSourceRuleJSON,
      text: undefined,
    })
    // form.setFieldValue('infoSourceRule', {
    //   json: infoSourceRuleJSON,
    //   text: undefined,
    // })
    form.setFieldValue('infoSourceDesc', data.infoSourceDesc)
    form.setFieldValue('id', data.key)
    showDrawer()
  }
  //删除信源
  const onRemove = (data) => {
    Modal.confirm({
      content: '删除信源',
      onOk: () => {
        goDeleteInfoSource(data)
      },
    })
  }
  const goDeleteInfoSource = async (data) => {
    const res = await http.get(`/infosource/deleteById?id=${data.key}`)
    if (res.status === 200) {
      message.info('删除成功')
      loadList('')
    } else {
      message.error('删除失败')
    }
  }
  //模糊查找
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
  //信源参数管理,

  //信源列表管理 统一管理数据 将来修改给setInfoSource传对象
  const [infoSource, setInfoSource] = useState({
    list: [], //信源列表
    count: 0, //信源数量
  })
  const loadList = async (keyword) => {
    const transData = {
      page: pageParams.page,
      per_page: pageParams.per_page,
      keyword: keyword,
    }
    const res = await http.get('/infosource/findall', { params: transData })
    if (res.data.data) {
      const { records, total } = res.data.data
      console.log('record:', records)
      const infoSourceInfoList = records.map((item, index) => ({
        key: item.id,
        number: (index + 1).toString(),
        infoSourceName: item.infoSourceName,
        infoSourceUrl: item.infoSourceUrl,
        infoSourceRule: item.infoSourceRule,
        createTime: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
        createUser: item.createUser,
        updateTime: moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
        updateUser: item.updateUser,
        infoSourceDesc: item.infoSourceDesc,
      }))
      setInfoSource({
        list: infoSourceInfoList,
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
    form.setFieldValue('infoSourceName', '')
    form.setFieldValue('infoSourceUrl', '')
    form.setFieldValue('infoSourceRule', '')
    form.setFieldValue('infoSourceDesc', '')
    setJsonContent({
      json: {},
      text: undefined,
    })
    setOpen(false)
  }
  const showDrawer = () => {
    form.setFields([
      {
        name: 'infoSourceName',
        errors: [],
      },
      {
        name: 'infoSourceUrl',
        errors: [],
      },
      {
        name: 'infoSourceRule',
        errors: [],
      },
      {
        name: 'infoSourceDesc',
        errors: [],
      },
    ])
    setOpen(true)
  }
  //提交表单前对json进行验证
  const onValide = (values) => {
    try {
      if (jsonContent?.text) {
        JSON.parse(jsonContent?.text)
      }
      console.log('content内容：', jsonContent)
      onFinish(values)
    } catch (error) {
      console.log('错误信息:', error)
      setIsValidate(true)
      message.error('输入正确的json内容')
      setIsValidate(false)
    }
  }
  //提交表单
  const onFinish = async (values) => {
    console.log('提交的表单：', typeof jsonContent)
    const formData = new FormData()
    formData.append('infoSourceName', values.infoSourceName)
    formData.append('infoSourceUrl', values.infoSourceUrl)
    // formData.append('infoSourceRule', values.infoSourceRule.text)
    formData.append(
      'infoSourceRule',
      jsonContent?.hasOwnProperty('json')
        ? JSON.stringify(jsonContent.json)
        : jsonContent.text
    )

    formData.append('infoSourceDesc', values.infoSourceDesc)
    if (isCreate) {
      const response = await http.post('/infosource/insert', formData)
      if (response.data.data) {
        message.success('新建成功')
        onClose()
        loadList('')
      } else {
        message.error('新建失败')
      }
    } else {
      formData.append('id', values.id)
      const response = await http.post('/infosource/update', formData)
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
      fixed: 'left',
      width: '5%',
    },
    {
      title: '信源名称',
      dataIndex: 'infoSourceName',
      key: 'infoSourceName',
      width: '13%',
      fixed: 'left',
    },
    {
      title: '信源链接',
      dataIndex: 'infoSourceUrl',
      key: 'infoSourceUrl',
      width: '20%',
    },
    {
      title: '备注',
      dataIndex: 'infoSourceDesc',
      key: 'infoSourceDesc',
      width: '25%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '15%',
    },
    {
      title: '操作',
      key: 'action',
      width: '17%',
      fixed: 'right',
      render: (data) => (
        <Space size="middle">
          {checkFunction(
            <Button onClick={() => onUpdate(data)}>更新</Button>,
            '11002'
          )}
          {checkFunction(
            <Button danger onClick={() => onRemove(data)}>
              删除
            </Button>,
            '11003'
          )}
          <Button onClick={() => openDetailDrawer(data)}>详情</Button>
        </Space>
      ),
    },
  ]
  //确保实体唯一性
  const detectOnlyOne = async (infoSourceName) => {
    const response = await http.get('/infosource/isNotExist', {
      params: { infoSourceName },
    })
    const data = response.data.data
    console.log('响应内容：', data)
    return data
  }
  //查看详情：
  const [openDetail, setOpenDetail] = useState(false)
  const [detail, setDetail] = useState([])
  const openDetailDrawer = (data) => {
    console.log(data)
    const id = data.key
    let infoSourceRuleJSON = {}

    try {
      infoSourceRuleJSON = JSON.parse(data.infoSourceRule)
    } catch (error) {
      message.error('信源规则格式错误，请检查！')
      console.error('待更新的格式错误', data.infoSourceRule)
    }
    const info = [
      {
        key: 'id',
        label: '信源id',
        children: data.key,
        span: 1.5,
      },
      {
        key: 'infoSourceName',
        label: '信源名称',
        children: data.infoSourceName,
        span: 1.5,
      },
      {
        key: 'infoSourceUrl',
        label: '信源链接',
        children: data.infoSourceUrl,
        span: 3,
      },
      {
        key: 'createTime',
        label: '创建时间',
        children: data.createTime,
        span: 1.5,
      },
      {
        key: 'createUser',
        label: '创建用户',
        children: data.createUser,
        span: 1.5,
      },
      {
        key: 'updateTime',
        label: '更新时间',
        children: data.updateTime,
        span: 1.5,
      },
      {
        key: 'updateUser',
        label: '更新用户',
        children: data.updateUser,
        span: 1.5,
      },
      {
        key: 'infoSourceRule',
        label: '信源采集规则',
        // children: <ReactJson src={infoSourceRuleJSON}></ReactJson>,
        children: (
          <pre>
            <code>{JSON.stringify(infoSourceRuleJSON, null, 2)}</code>
          </pre>
        ),
        span: 3,
      },
      {
        key: 'infoSourceDesc',
        label: '备注',
        children: data.infoSourceDesc,
        span: 3,
      },
    ]
    setDetail(info)
    setOpenDetail(true)
  }
  const closeDetailDrawer = () => {
    setOpenDetail(false)
  }
  //json设置
  const [jsonContent, setJsonContent] = useState({
    json: {},
    text: undefined,
  })
  //json验证：
  return (
    <div className="datatask">
      <Layout className="main">
        <div style={{ background: 'white' }}>
          <Content className="tasklist">信源列表</Content>
        </div>
        <Header className="header">
          <Search
            className="search"
            placeholder="信源名称"
            onSearch={onSearch}
          />
          {checkFunction(
            <Button className="new" type="primary" onClick={goNew}>
              新建
            </Button>,
            '11004'
          )}
        </Header>

        <Content className="content">
          <Table
            scroll={{ x: 1300 }}
            dataSource={infoSource.list}
            columns={columns}
            pagination={{ position: ['none', 'none'] }}
          />
          <Pagination
            current={pageParams.page}
            onChange={onChangePage}
            pageSize={pageParams.per_page}
            total={infoSource.count}
            hideOnSinglePage
          />
          <Drawer
            title={isCreate ? '新建信源' : '更新信源'}
            placement={placement}
            size="large"
            onClose={onClose}
            open={open}>
            {/* 内部展示 */}
            <Form
              name="basic"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onValide}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form}>
              <Form.Item label="id" name="id" hidden={isCreate}>
                <Input disabled></Input>
              </Form.Item>
              <Form.Item
                label="信源名称"
                name="infoSourceName"
                rules={
                  isCreate
                    ? [
                        {
                          required: true,
                          message: '请输入信源名称!',
                        },
                        ({ getFieldValue }) => ({
                          async validator(_, value) {
                            console.log('是否重复测试value:', value)
                            console.log(
                              'infoSourceName:',
                              getFieldValue('infoSourceName')
                            )
                            const res = await detectOnlyOne(
                              getFieldValue('infoSourceName')
                            )
                            if (!res) {
                              return Promise.reject('信源已存在')
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]
                    : []
                }>
                <Input />
              </Form.Item>
              <Form.Item
                label="信源链接"
                name="infoSourceUrl"
                rules={[
                  {
                    required: true,
                    message: '请输入信源链接！',
                  },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item label="信源规则" name="infoSourceRule">
                <JSONEditorReact
                  mode="text"
                  content={jsonContent}
                  onChange={setJsonContent}></JSONEditorReact>
              </Form.Item>
              <Form.Item label="备注" name="infoSourceDesc">
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}>
                <Button disabled={isValidate} type="primary" htmlType="submit">
                  {isCreate ? '新建' : '更新'}操作
                </Button>
              </Form.Item>
            </Form>
            <></>
          </Drawer>
          {/* 查看详情 */}
          <Drawer
            title="详情"
            size="large"
            open={openDetail}
            onClose={closeDetailDrawer}>
            <Descriptions items={detail} bordered />
          </Drawer>
        </Content>
      </Layout>
    </div>
  )
}
export default InfoSource
