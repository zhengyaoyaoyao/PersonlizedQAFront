import React, { useEffect } from 'react'
import { useState } from 'react'
import {
  Button,
  Layout,
  Space,
  Table,
  Input,
  Drawer,
  Form,
  Select,
  Modal,
  Switch,
  message,
  Badge,
  Pagination,
  Descriptions,
  Tag,
  Upload,
  Dropdown,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { UploadOutlined, DownOutlined } from '@ant-design/icons'
import { http } from '../../utils'
import moment from 'moment'
import JSONEditorReact from '../../components/JSONEditorReact'
import { checkFunction, hasPermission } from '../../utils/authFunction'
import './index.scss'
const { Header, Content } = Layout
const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
]
const Task = () => {
  const navigate = useNavigate()
  const [isCreate, setIsCreate] = useState(true)
  const [isValidate, setIsValidate] = useState(false)
  const [selectInfoSourceName, setSelectInfoSourceName] = useState([])
  //查看详情：
  const [openDetail, setOpenDetail] = useState(false)
  const [detail, setDetail] = useState([])
  const openDetailDrawer = async (data) => {
    console.log('任务详情信息:', data)
    const id = data.key
    //需要信源的链接
    const infoSource = (
      await http.get(
        `/infosource/getByName?infoSourceName=${data.infoSourceName}`
      )
    ).data.data
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
        label: '任务id',
        children: data.key,
        span: 1.5,
      },
      {
        key: 'taskName',
        label: '任务名称',
        children: data.taskName,
        span: 1.5,
      },
      {
        key: 'charge',
        label: '任务负责人',
        children: data.charge,
        span: 1.5,
      },
      {
        key: 'taskTime',
        label: '任务时间',
        children: data.taskTime,
        span: 1.5,
      },
      {
        key: 'taskCollectionName',
        label: '任务代号',
        children: data.taskCollectionName,
        span: 1.5,
      },
      {
        key: 'infoSourceName',
        label: '标注信源',
        children: data.infoSourceName,
        span: 1.5,
      },
      {
        key: 'infoSourceUrl',
        label: '信源地址',
        children: infoSource.infoSourceUrl,
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
        children: (
          <pre>
            <code>{JSON.stringify(infoSourceRuleJSON, null, 2)}</code>
          </pre>
        ),
        span: 3,
      },
      {
        key: 'taskNote',
        label: '额外信息',
        children: data.taskNote,
        span: 3,
      },
      {
        key: 'members',
        label: '任务成员',
        children: (
          <div>
            {data.members.map((member, index) => {
              const color = colors[index % colors.length]
              return (
                <Tag key={index} color={color}>
                  {member}
                </Tag>
              )
            })}
          </div>
        ),
        span: 3,
      },
      {
        key: 'isFinish',
        label: '采集状态',
        children: data.status ? (
          <Badge status="success" text="Success" />
        ) : (
          <Badge status="processing" text="Processing" />
        ),
        span: 3,
      },
    ]
    setDetail(info)
    setOpenDetail(true)
  }
  const closeDetailDrawer = () => {
    setOpenDetail(false)
  }
  //删除信息
  const onRemove = (data) => {
    Modal.confirm({
      content: '删除信源',
      onOk: () => {
        goDeleteTask(data)
      },
    })
  }
  const goDeleteTask = async (data) => {
    const res = await http.get(`/task/deleteById?id=${data.key}`)
    if (res.status === 200) {
      message.info('删除成功')
      loadList('')
    } else {
      message.error('删除失败')
    }
  }
  //更新操作
  const onUpdate = (data) => {
    setIsCreate(false)
    console.log('具体信息', data)
    let infoSourceRuleJSON = {}
    try {
      infoSourceRuleJSON = JSON.parse(data.infoSourceRule)
    } catch (error) {
      infoSourceRuleJSON = { errorFormat: data.infoSourceRule }
      console.error(error)
    }
    const infoSourceId = infoSources.find(
      (item) => item.label === data.infoSourceName
    )?.value
    console.log('信源id:', infoSourceId)
    form.setFieldValue('infoSource', infoSourceId)
    form.setFieldValue('id', data.key)
    form.setFieldValue('taskName', data.taskName)
    form.setFieldValue('taskCollectionName', data.taskCollectionName)
    form.setFieldValue('charge', data.charge)
    form.setFieldValue('taskTime', data.taskTime)
    form.setFieldValue('status', data.status)
    form.setFieldValue('infoSource', infoSourceId)
    form.setFieldValue('proMembers', data.members)
    form.setFieldValue('taskNote', data.taskNote)
    showDrawer()
  }
  //展示页面的列
  const goDetail = (id) => {
    navigate(`/task/taskfiles?id=${id}`)
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
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: '20%',
      fixed: 'left',
    },
    {
      title: '任务负责人',
      dataIndex: 'charge',
      key: 'charge',
      width: '8%',
    },
    {
      title: '任务信源',
      dataIndex: 'infoSourceName',
      key: 'infoSourceName',
      width: '20%',
    },
    {
      title: '任务时间安排',
      dataIndex: 'taskTime',
      key: 'taskTime',
      width: '15%',
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      width: '7%',
      render: (data) => {
        const status = data
        return status ? (
          <Badge status="success" text="已完成" />
        ) : (
          <Badge status="error" text="未完成" />
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '25%',
      render: (data) => (
        <Space size="middle" align="center">
          {checkFunction(
            <Button onClick={() => onUpdate(data)}>更新</Button>,
            '10002'
          )}
          {checkFunction(
            <Button danger onClick={() => onRemove(data)}>
              删除
            </Button>,
            '10003'
          )}
          {checkFunction(
            <Button onClick={() => goDetail(data.key)}>审核</Button>,
            '10005'
          )}

          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: <a onClick={() => openDetailDrawer(data)}>详情</a>,
                },
                {
                  key: '2',
                  label: <a onClick={() => openDrawerUpload(data)}>上传</a>,
                },
                {
                  key: '3',
                  label: (
                    <a onClick={() => openDrawerAttachFile(data)}>附件上传</a>
                  ),
                },
              ],
            }}>
            <Button>
              更多<DownOutlined></DownOutlined>
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ]
  //模糊查找
  const onSearch = async (value) => {
    console.log(value)
    loadList(value)
  }
  const [pageParams, setPageParams] = useState({
    page: 1, //当前页
    per_page: 10, //每页多少
  })
  //信息展示
  useEffect(() => {
    loadList('')
  }, [pageParams])
  //信源列表管理 统一管理数据 将来修改给setInfoSource传对象
  const [Tasks, setTasks] = useState({
    list: [], //信源列表
    count: 0, //信源数量
  })
  const loadList = async (keyword) => {
    const transData = {
      page: pageParams.page,
      per_page: pageParams.per_page,
      keyword: keyword,
    }
    const res = await http.get('/task/findall', { params: transData })
    if (res.data.data) {
      const { records, total } = res.data.data
      console.log('record:', records)
      const TaskInfoList = records.map((item, index) => ({
        key: item.id,
        number: (index + 1).toString(),
        createTime: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
        createUser: item.createUser,
        updateTime: moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
        updateUser: item.updateUser,
        taskName: item.taskName,
        taskCollectionName: item.taskCollectionName,
        charge: item.charge,
        members: item.members,
        taskTime: item.taskTime,
        infoSourceName: item.infoSourceName,
        infoSourceRule: item.infoSourceRule,
        taskNote: item.taskNote,
        status: item.status,
      }))
      setTasks({
        list: TaskInfoList,
        count: total,
      })
    }
  }

  //翻页设置
  const onChangePage = (page) => {
    console.log(page)
    setPageParams({
      ...pageParams,
      page: page,
    })
  }

  //处理新建
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState()
  const showDrawer = () => {
    form.setFields([
      {
        name: 'taskName',
        errors: [],
      },
    ])
    setOpen(true)
  }
  const onClose = () => {
    form.resetFields([
      'taskName',
      'charge',
      'infoSource',
      'status',
      'infoSource',
      'proMembers',
      'taskTime',
    ])
    setInfoSourcesRule({
      json: {},
      text: undefined,
    })
    setOpen(false)
  }
  //新建函数

  const onValide = (values) => {
    if (isCreate) {
      const rule = values.infoSourceRule.text
      try {
        JSON.parse(rule)
        onFinish(values)
      } catch (error) {
        console.log('错误信息：', error)
        setIsValidate(true)
        message.error('请输入正确的json内容')
        setIsValidate(false)
      }
    } else {
      onFinish(values)
    }
  }
  //提交表单
  const onFinish = async (values) => {
    setUpdating(true)
    console.log('表单提交信息：', values)
    const formData = new FormData()
    formData.append('taskName', values.taskName)
    formData.append('charge', values.charge)
    formData.append('proMembers', values.proMembers)
    formData.append('taskCollectionName', values.taskCollectionName)
    formData.append('taskTime', values.taskTime)
    formData.append('infoSource', values.infoSource)
    formData.append('taskNote', values.taskNote)
    formData.append(
      'status',
      values.status !== undefined ? values.status : false
    )
    if (isCreate) {
      formData.append('infoSourceRule', values.infoSourceRule.text)
      const response = await http.post('/task/insert', formData)
      if (response.data.data) {
        message.success('新建成功')
        onClose()
        loadList('')
      } else {
        message.error('新建失败')
      }
    } else {
      formData.append('id', values.id)
      const response = await http.post('/task/update', formData)
      if (response.data.data) {
        message.success('更新成功')
        onClose()
        loadList('')
      } else {
        message.error('更新失败')
      }
    }
    setUpdating(false)
  }
  // 处理数据格式转换的函数
  const transformData = (data) => {
    const result = {}
    //遍历数据数组
    data.forEach((item) => {
      const organization = item.organization
      const usernames = item.usernames.split(',')
      //如果组织在映射中不存在，创建一个新的组织条目
      if (!result[organization]) {
        result[organization] = {
          label: organization,
          options: [],
        }
      }
      //遍历用户名
      usernames.forEach((username) => {
        result[organization].options.push({
          label: username,
          value: username.toLowerCase(),
        })
      })
    })
    const resultArray = Object.values(result)
    return resultArray
  }

  //加载组织人员信息
  const loadUser = async () => {
    //加载组织和人员，key:value
    const response = await http.get('/user/organizations')
    if (response.data.data) {
      const organizationUser = response.data.data
      const transformerData = transformData(organizationUser)
      setUser(transformerData)
    }
  }
  //新建任务
  const [form] = Form.useForm()
  const goNew = () => {
    setSelectInfoSourceName([])
    setIsCreate(true)
    showDrawer()
  }
  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  useEffect(() => {
    //加载人员下拉列表
    loadUser()
  }, [])
  //新建-信源绑定
  const [infoSourcesRule, setInfoSourcesRule] = useState({
    json: {},
    text: undefined,
  })
  //获取所有信源的信息，包括id，信源名称，信源的标注规则
  const [infoSources, setInfoSources] = useState([])
  const [infoSourcesList, setInfoSourcesList] = useState([])
  const loadInfoSources = async () => {
    const response = await http.get('/infosource/getInfoSources')
    console.log(response)
    if (response.data.data) {
      const InfoSourceList = response.data.data
      setInfoSourcesList(InfoSourceList)
      const infoSources = InfoSourceList
        ? Object.keys(InfoSourceList).map((key) => ({
            value: InfoSourceList[key].id,
            label: InfoSourceList[key].infoSourceName,
          }))
        : ''
      setInfoSources(infoSources)
    }
  }
  //信源的选择框
  const onChangeInfoSource = (value) => {
    //获得当前选择的任务id，通过任务id设置规则,value是当前信源id
    infoSourcesList.forEach((item) => {
      if (item.id === value) {
        let rule = {}
        try {
          rule = JSON.parse(item.infoSourceRule)
        } catch (error) {
          rule = { errorFormat: item.infoSourceRule }
        }
        form.setFieldValue(
          'infoSourceRule',
          setInfoSourcesRule({
            json: rule,
            text: undefined,
          })
        )
      }
    })
    console.log(value)
  }
  const onSearchInfoSource = () => {}
  useEffect(() => {
    //获取信息源
    loadInfoSources()
  }, [])
  const { Search } = Input

  //上传文件相关
  const [uploadFileDrawerStatus, setUploadFileDrawerStatus] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [upDataFile, setUpDataFile] = useState(null)
  const [fileList, setFileList] = useState([])
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
  const openDrawerUpload = (data) => {
    if (data) {
      console.log(data)
      setUploadFileDrawerStatus(true)
      setUpDataFile(data)
    }
  }
  const onCloseUpFile = () => {
    setUploadFileDrawerStatus(false)
  }
  const handleUpload = (upDataFile) => {
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('files', file)
    })
    console.log(upDataFile)
    //对应的任务，要存进去的集合
    formData.append('id', upDataFile.key)
    formData.append('taskCollectionName', upDataFile.taskCollectionName)
    goUpload(formData)
  }
  const goUpload = async (formData) => {
    setUploading(true)
    try {
      const response = await http.post('/task/uploadFiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('上传文件信息:', response)
      setFileList([])
      message.success('upload successfully.')
    } catch (error) {
      message.error('upload failed.')
    } finally {
      setUploading(false)
    }
  }
  //检测任务名唯一性
  const detectOnlyOne = async (taskName) => {
    const response = await http.get('/task/isNotExist', {
      params: { taskName },
    })
    const data = response.data.data
    console.log('响应内容', data)
    return data
  }
  //控件异步控制
  const [updating, setUpdating] = useState(false)

  //附件信息转化
  const [uploadAttachDrawerStatus, setuploadAttachDrawerStatus] =
    useState(false)
  const openDrawerAttachFile = (data) => {
    if (data) {
      console.log(data)
      setuploadAttachDrawerStatus(true)
      setUpDataFile(data)
    }
  }
  const onCloseUpAttach = () => {
    setuploadAttachDrawerStatus(false)
  }
  const handleUploadAttach = (upDataFile) => {
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('files', file)
    })
    console.log(upDataFile)
    //对应的任务，要存进去的集合
    formData.append('id', upDataFile.key)
    formData.append('taskCollectionName', upDataFile.taskCollectionName)
    goUploadAttach(formData)
  }
  const goUploadAttach = async (formData) => {
    setUploading(true)
    try {
      const response = await http.post('/task/uploadAttachs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      })
      // console.log('上传的附件信息:', response.data.data)
      console.log(response)
      // 创建 Blob 对象并下载文件
      const blob = new Blob([response.data], {
        type: 'application/octet-stream',
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'attachInfo.txt' // 设置下载文件名
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      setFileList([])
      message.success('注意查看附件信息')
    } catch (error) {
      message.error('upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <Layout className="main">
        <div style={{ background: 'white' }}>
          <Content className="tasklist">任务列表</Content>
        </div>
        <Header className="header">
          <Search
            className="search"
            placeholder="任务名称"
            onSearch={onSearch}
          />
          {checkFunction(
            <Button
              className="new"
              type="primary"
              onClick={goNew}
              loading={updating}>
              新建
            </Button>,
            '10004'
          )}
        </Header>

        <Content className="content">
          <Table
            columns={columns}
            dataSource={Tasks.list}
            scroll={{ x: 1300 }}
            pagination={{ position: ['none', 'none'] }}
          />
          <Pagination
            current={pageParams.page}
            onChange={onChangePage}
            pageSize={pageParams.per_page}
            total={Tasks.count}
            hideOnSinglePage
          />
          <Drawer
            title={isCreate ? '新建任务' : '更新任务'}
            open={open}
            placement="right"
            size="large"
            onClose={onClose}>
            <Form
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
              onFinish={onValide}
              form={form}>
              <Form.Item label="id" name="id" hidden={isCreate}>
                <Input disabled></Input>
              </Form.Item>
              <Form.Item
                label="任务名字"
                name="taskName"
                rules={
                  isCreate
                    ? [
                        {
                          required: true,
                          message: '请输入任务名称',
                        },
                        ({ getFieldValue }) => ({
                          async validator(_, value) {
                            console.log('是否重复测试value', value)
                            console.log('taskName', getFieldValue('taskName'))
                            const res = await detectOnlyOne(
                              getFieldValue('taskName')
                            )
                            if (!res) {
                              return Promise.reject('任务已存在')
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]
                    : []
                }>
                <Input></Input>
              </Form.Item>
              <Form.Item label="任务代号" name="taskCollectionName">
                <Input></Input>
              </Form.Item>
              <Form.Item label="负责人" name="charge">
                <Input></Input>
              </Form.Item>
              <Form.Item label="项目成员" name="proMembers">
                <Select
                  mode="multiple"
                  onChange={handleChange}
                  options={user}
                />
              </Form.Item>
              <Form.Item name="taskTime" label="任务安排时间">
                <Input></Input>
              </Form.Item>
              <Form.Item name="infoSource" label="任务信源">
                <Select
                  disabled={!isCreate}
                  showSearch
                  placeholder="选择信源"
                  onChange={onChangeInfoSource}
                  onSearch={onSearchInfoSource}
                  defaultValue={selectInfoSourceName}
                  options={infoSources}></Select>
              </Form.Item>
              <Form.Item name="infoSourceRule" label="采集规则">
                {isCreate ? (
                  <JSONEditorReact
                    mode="text"
                    content={infoSourcesRule}
                    onChange={setInfoSourcesRule}></JSONEditorReact>
                ) : (
                  <pre>
                    <code>{JSON.stringify(infoSourcesRule, null, 2)}</code>
                  </pre>
                )}
              </Form.Item>
              <Form.Item name="taskNote" label="备注信息">
                <Input.TextArea></Input.TextArea>
              </Form.Item>
              <Form.Item label="状态" name="status" valuePropName="checked">
                <Switch />
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
          </Drawer>
          <Drawer
            title="详情"
            size="large"
            open={openDetail}
            onClose={closeDetailDrawer}>
            <Descriptions items={detail} bordered />
          </Drawer>
          <Drawer
            title="上传文件"
            width={500}
            onClose={onCloseUpFile}
            placement="right"
            open={uploadFileDrawerStatus}>
            <>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>点击上传</Button>
              </Upload>
              <Button
                type="primary"
                onClick={() => handleUpload(upDataFile)}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}>
                {uploading ? 'Uploading' : 'Start Upload'}
              </Button>
            </>
          </Drawer>
          <Drawer
            title="上传附件"
            width={500}
            onClose={onCloseUpAttach}
            placement="right"
            open={uploadAttachDrawerStatus}>
            <>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>上传附件</Button>
              </Upload>
              <Button
                type="primary"
                onClick={() => handleUploadAttach(upDataFile)}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}>
                {uploading ? 'Uploading' : 'Start Upload'}
              </Button>
            </>
          </Drawer>
        </Content>
      </Layout>
    </div>
  )
}
export default Task
