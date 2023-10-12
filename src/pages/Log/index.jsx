import React, { useEffect, useState } from 'react'
import { Table, Pagination, Layout } from 'antd'
import { http } from '../../utils'
import moment from 'moment'

const { Header, Content } = Layout
const Log = () => {
  const OperationType = {
    0: 'INSERT',
    1: 'UPDATE',
    2: 'DELETE',
    3: 'EXPORT',
    4: 'IMPORT',
    5: 'OTHER',
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
      // sorter: (a, b) => b.number - a.number,
      width: '5%',
    },
    {
      title: '操作描述',
      dataIndex: 'description',
      key: 'description',
      width: '10%',
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: '10%',
    },
    {
      title: '参数',
      dataIndex: 'params',
      key: 'params',
      width: '10%',
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: '10%',
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: '5%',
    },
    {
      title: '操作人员',
      dataIndex: 'actionUser',
      key: 'actionUser',
      width: '10%',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      width: '10%',
    },
    {
      title: '操作时间',
      dataIndex: 'actionTime',
      key: 'actionTime',
      // sorter: (a, b) => moment(b.actionTime).diff(moment(a.actionTime)),
      width: '10%',
    },
    {
      title: '操作权限',
      dataIndex: 'actionAuthority',
      key: 'actionAuthority',
      width: '10%',
    },
  ]
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra)
  }
  const [logList, setLogList] = useState({
    list: [], //
    count: 0,
  })
  const [pageParams, setPageParams] = useState({
    page: 1, //当前页
    per_page: 10, //每页多少
  })
  const loadDetail = async (keyword) => {
    const transData = {
      page: pageParams.page,
      per_page: pageParams.per_page,
      keyword: keyword,
    }
    const response = await http.get('/log/findall', { params: transData })

    if (response.data.data) {
      const { records, total } = response.data.data
      const logList = records.map((item, index) => ({
        actionId: item.id,
        number: (index + 1).toString(),
        description: item.description,
        method: item.method,
        params: item.params,
        operationType: OperationType[item.operationType],
        duration: item.duration + 'ms',
        actionUser: item.actionUser,
        ip: item.ip,
        actionTime: moment(item.actionTime).format('YYYY-MM-DD HH:mm:ss'),
        actionAuthority: item.actionAuthority,
      }))
      setLogList({
        list: logList,
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
  useEffect(() => {
    loadDetail('')
  }, [pageParams])
  return (
    <div>
      <Layout className="main">
        <div style={{ background: 'white' }}>
          <Content className="tasklist">日志信息</Content>
        </div>
        <Content className="content">
          <Table
            columns={columns}
            dataSource={logList.list}
            onChange={onChange}
            pagination={{ position: ['none', 'none'] }}
            scroll={{
              y: 700,
            }}
          />
          <Pagination
            current={pageParams.page}
            onChange={onChangePage}
            pageSize={pageParams.per_page}
            total={logList.count}
            hideOnSinglePage
          />
        </Content>
      </Layout>
    </div>
  )
}
export default Log
