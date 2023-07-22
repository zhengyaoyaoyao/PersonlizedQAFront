import React, { useEffect, useState } from 'react'
import {
  Layout,
  Button,
  Input,
  Table,
  Space,
  Pagination,
  message,
  Modal,
} from 'antd'
import './index.scss'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { http } from '../../utils'
import { checkFunction, hasPermission } from '../../utils/authFunction'

const { Header, Content } = Layout
const DataTask = () => {
  //删除操作：
  const goDelete = (index) => {
    console.log('删除的record信息:', index)
    Modal.confirm({
      content: '删除任务',
      onOk: () => {
        goDeleteTask(index)
      },
    })
  }
  const goDeleteTask = async (index) => {
    const res = await http.get(`/annotationtask/deleteById?id=${index.key}`)

    if (res.status === 200) {
      if (res.data.data) {
        message.info('删除成功')
      } else {
        message.info('删除失败')
      }
      loadList('')
    } else {
      message.error('删除请求发送失败')
    }
  }
  //标注页面：
  const goAnnotation = (index) => {
    navigate(`/datatask/annotation?id=${index.key}`)
  }
  //详情页：
  const goDetailInfo = (index) => {
    navigate(`/datatask/taskinfo?id=${index.key}`)
  }
  //模糊搜索
  const onSearch = async (value) => {
    console.log(value)
    loadList(value)
  }
  //任务信息参数管理,
  const [pageParams, setPageParams] = useState({
    page: 1, //当前页
    per_page: 5, //每页多少
  })
  //任务列表管理 统一管理数据 将来修改给setTasks传对象
  const [tasks, setTasks] = useState({
    list: [], //任务列表
    count: 0, //任务数量
  })
  //获得任务列表
  const loadList = async (keyword) => {
    const transData = {
      page: pageParams.page,
      per_page: pageParams.per_page,
      keyword: keyword,
    }
    const res = await http.get('/annotationtask/findall', { params: transData })
    if (res.data.data) {
      const { records, total } = res.data.data
      console.log('recoder:', records)
      const tasksInfoList = records.map((item, index) => ({
        key: item.id,
        number: (index + 1).toString(),
        taskName: item.taskName,
        dataSet: item.dataSetName,
        taskType: item.taskType,
        dataType: item.dataType,
        fileNumber: item.fileNumber,
        taskUser: item.taskUser,
        createTime: item.createTime
          ? moment(item.createTime).format('YYYY-MM-DD')
          : '',
        updateTime: item.updateTime
          ? moment(item.updateTime).format('YYYY-MM-DD')
          : '',
      }))
      setTasks({
        list: tasksInfoList,
        count: total,
      })
    }
  }
  useEffect(() => {
    loadList('')
  }, [pageParams])
  const { Search } = Input
  const columns = [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '标记数据集',
      dataIndex: 'dataSet',
      key: 'dataSet',
    },
    {
      title: '标注类型',
      dataIndex: 'taskType',
      key: 'taskType',
    },
    {
      title: '标注数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
    },
    {
      title: '文件个数',
      dataIndex: 'fileNumber',
      key: 'fileNumber',
    },
    {
      title: '任务负责人',
      dataIndex: 'taskUser',
      key: 'taskUser',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, index, record) => (
        <Space size="middle">
          <Button onClick={() => goDetailInfo(index)} size="small">
            详情
          </Button>
          <Button onClick={() => goAnnotation(index)} size="small">
            标注
          </Button>
          <Button onClick={() => goDelete(index)} danger size="small">
            删除
          </Button>
        </Space>
      ),
    },
  ]

  //新建，跳转新建页面
  const navigate = useNavigate()
  const goNew = () => {
    navigate('/datatask/taskNew')
  }
  //翻页设置
  const onChangePage = (page) => {
    console.log(page)
    setPageParams({
      ...pageParams,
      page: page,
    })
  }
  return (
    <div className="datatask">
      <Layout className="main" style={{ background: 'beige' }}>
        <Header className="header">
          {checkFunction(
            <Button type="primary" onClick={goNew}>
              新建
            </Button>,
            '11'
          )}
          <Button
            type="primary"
            onClick={goNew}
            disabled={hasPermission('111')}>
            新建
          </Button>

          <Button type="primary" onClick={goNew} disabled>
            新建
          </Button>
          <Search
            className="search"
            placeholder="根据任务名称进行搜索"
            style={{
              width: 400,
            }}
            onSearch={onSearch}
          />
        </Header>
        <Content className="tasklist">任务列表</Content>
        <Content className="content">
          <Table
            dataSource={tasks.list}
            columns={columns}
            pagination={{ position: ['none', 'none'] }}
          />
          <Pagination
            current={pageParams.page}
            onChange={onChangePage}
            pageSize={pageParams.per_page}
            total={tasks.count}
            hideOnSinglePage
          />
        </Content>
      </Layout>
    </div>
  )
}

export default DataTask
