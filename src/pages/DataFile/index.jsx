import React, { useEffect, useRef, useState } from 'react'
import {
  Layout,
  Button,
  Input,
  Table,
  Space,
  Modal,
  message,
  Upload,
  Drawer,
  Pagination,
} from 'antd'
import './index.scss'
import { useNavigate } from 'react-router-dom'
import { UploadOutlined } from '@ant-design/icons'
import { http } from '../../utils'
import moment from 'moment'
const { Header, Content } = Layout
const DataFile = () => {
  //模糊查找
  const onSearch = async (value) => {
    console.log(value)
    loadList(value)
  }

  //下载数据集
  const onDown = async (data) => {
    //需要数据id和数据集名称
    try {
      const transData = {
        id: data.key,
        dataName: data.name,
      }
      const response = await http.get('/dataset/download', {
        params: transData,
        responseType: 'blob',
      })
      const blob = new Blob([response.data], {
        type: 'application/octet-stream',
      })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${data.name}.zip`) // Set the desired file name
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  //添加文件
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState('right')
  const [upDataFile, setUpDataFile] = useState(null)
  const showDrawer = (data) => {
    if (data) {
      setOpen(true)
      setUpDataFile(data)
    }
  }
  const onChange = (e) => {
    setPlacement(e.target.value)
  }
  const onClose = () => {
    setFileList([])
    setOpen(false)
    loadList('')
  }

  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)
  const handleUpload = (upDataFile) => {
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('files', file)
    })
    console.log(upDataFile)
    formData.append('id', upDataFile.key)
    goUpload(formData)
  }
  const goUpload = async (formData) => {
    setUploading(true)
    try {
      const response = await http.post('/dataset/uploadFiles', formData, {
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
  //删除文件
  const onRemove = (data) => {
    Modal.confirm({
      content: '删除数据集',
      onOk: () => {
        goDeleteDataSet(data)
      },
    })
  }
  //数据集参数管理,
  const [pageParams, setPageParams] = useState({
    page: 1, //当前页
    per_page: 5, //每页多少
  })
  //数据集列表管理 统一管理数据 将来修改给setDataset传对象
  const [dataSet, setDataSet] = useState({
    list: [], //数据集列表
    count: 0, //数据集数量
  })

  //获取数据集列表
  const loadList = async (keyword) => {
    const transData = {
      page: pageParams.page,
      per_page: pageParams.per_page,
      keyword: keyword,
    }
    const res = await http.get('/dataset/findall', { params: transData })
    if (res.data.data) {
      const { records, total } = res.data.data
      console.log('record:', records)
      const dataSetInfoList = records.map((item, index) => ({
        key: item.id,
        number: (index + 1).toString(),
        name: item.dataName,
        url: item.dataUrl,
        filesSize: item.filesSize,
        createDate: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
        createUser: item.createUser,
        updateUser: item.updateUser,
      }))
      setDataSet({
        list: dataSetInfoList,
        count: total,
      })
    }
  }
  useEffect(() => {
    loadList('')
  }, [pageParams])
  const { Search } = Input
  // 数据集详情
  const navigate = useNavigate()
  const goDatasetInfo = (data) => {
    navigate(`/dataset/datainfo?id=${data.key}`)
  }

  const goDeleteDataSet = async (data) => {
    const res = await http.get(`dataset/deleteById?id=${data.key}`)
    if (res.status === 200) {
      message.info('删除成功')
      loadList('')
      // window.location.reload() // 刷新页面
    } else {
      message.error('删除失败')
    }
    //只要res是成功的，那么就刷新一次页面，失败则提示
  }
  //删除逻辑和删除逻辑的弹出框信息
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('是否要删除此数据集？')
  const handleOk = (data) => {
    setModalText('是否要删除此数据集')
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
      setModalText('数据集将在2s后删除...')
      goDeleteDataSet(data)
    }, 2000)
    //先进行删除，删除成功了根据提示信息判断是否要关闭这个提示框
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '数据集来源',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '文件数',
      dataIndex: 'filesSize',
      key: 'filesSize',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
    },
    {
      title: '创建人',
      key: 'createUser',
      dataIndex: 'createUser',
    },
    {
      title: '最后更新用户',
      key: 'updateUser',
      dataIndex: 'updateUser',
    },
    {
      title: '操作',
      key: 'action',
      render: (data) => {
        return (
          <div>
            <Space size="middle">
              <Button type="primary" onClick={() => goDatasetInfo(data)}>
                详情
              </Button>
              <Button type="primary" danger onClick={() => onRemove(data)}>
                删除
              </Button>
              <Button type="primary" onClick={() => showDrawer(data)}>
                上传
              </Button>
              <Button onClick={() => onDown(data)}>下载数据集</Button>
            </Space>
          </div>
        )
      },
    },
  ]
  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])
      return false
    },
    fileList,
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
          <Search
            className="search"
            placeholder="根据数据集名称搜索"
            style={{
              width: 200,
            }}
            onSearch={onSearch}
          />
        </Header>
        <Content className="tasklist">数据集列表</Content>
        <Content className="content">
          <Table
            dataSource={dataSet.list}
            columns={columns}
            pagination={{ position: ['none', 'none'] }}
          />
          <Pagination
            current={pageParams.page}
            onChange={onChangePage}
            pageSize={pageParams.per_page}
            total={dataSet.count}
            hideOnSinglePage
          />
          <Drawer
            title="上传文件"
            placement={placement}
            width={500}
            onClose={onClose}
            open={open}>
            {/* 内部展示 */}
            <>
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>点击上传</Button>
              </Upload>
              <Button
                type="primary"
                onClick={() => handleUpload(upDataFile)}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{
                  marginTop: 16,
                }}>
                {uploading ? 'Uploading' : 'Start Upload'}
              </Button>
            </>
          </Drawer>
        </Content>
      </Layout>
    </div>
  )
}

export default DataFile
