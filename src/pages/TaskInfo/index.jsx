import React, { useEffect, useState } from 'react'
import {
  Button,
  Descriptions,
  Badge,
  Tag,
  Space,
  Col,
  Row,
  Select,
  Drawer,
  Form,
  Input,
  Radio,
} from 'antd'
import { useSearchParams } from 'react-router-dom'
import { http } from '../../utils'
import moment from 'moment'
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
const { Option } = Select

const TaskInfo = () => {
  const [taskInfo, setTaskInfo] = useState(null)
  const [params] = useSearchParams()
  const id = params.get('id')
  //加载详情信息
  const loadDetail = async () => {
    const res = await http.get(`/annotationtask/info?id=${id}`)
    const data = res.data.data
    setTaskInfo(data)
  }
  useEffect(() => {
    if (id) {
      loadDetail()
    }
  }, [id])
  //修改操作
  const [open, setOpen] = useState(false)
  //修改操作中加载所有数据集名称
  const [dataNames, setDataNames] = useState()
  const loadDataSetList = async () => {
    const res = await http.get('/dataset/datasetList')
    if (res.data.data) {
      const dataNameList = res.data.data.dataSetList
      const dataNames = dataNameList
        ? Object.keys(dataNameList).map((key) => ({
            value: dataNameList[key].id,
            label: dataNameList[key].data_name,
          }))
        : ''
      setDataNames(dataNames)
    }
  }
  //更改任务状态
  const onChangeStatus = (e) => {
    console.log('radio checked', e.target.value)
  }
  //选择任务类型
  const [typeNames, setTypeNames] = useState()
  const loadTaskTypeList = async () => {
    const res = await http.get('/tasktype/tasktypeList')

    if (res.data.data) {
      const TaskTpyeList = res.data.data.taskTypeList
      const taskTypes = TaskTpyeList
        ? Object.keys(TaskTpyeList).map((key) => ({
            value: TaskTpyeList[key].id,
            label: TaskTpyeList[key].type_name,
          }))
        : ''
      setTypeNames(taskTypes)
    }
  }
  //实体选择：
  const [entitys, setEntitys] = useState([])
  const loadEntityList = async () => {
    const res = await http.get('/entity/entityList')
    if (res.data.data) {
      const EntityList = res.data.data.entityList
      const entitys = EntityList
        ? Object.keys(EntityList).map((key) => ({
            value: EntityList[key].id,
            label: EntityList[key].name,
          }))
        : ''
      setEntitys(entitys)
    }
  }
  //表单实体选择
  const changeEntityUpdate = (value) => {
    console.log(`selected ${value}`)
  }
  //关系选择：
  const [relations, setRelations] = useState([])
  const loadRelationList = async () => {
    const res = await http.get('/relation/relationList')
    if (res.data.data) {
      const RelationList = res.data.data.relationList
      const relations = RelationList
        ? Object.keys(RelationList).map((key) => ({
            value: RelationList[key].id,
            label: RelationList[key].rel_name,
          }))
        : ''
      setRelations(relations)
    }
  }
  //加载文件
  const [files, setFiles] = useState([])
  const loadFiles = async (dataNameId) => {
    const res = await http.get(`/files/filesList?id=${dataNameId}`)
    if (res.data.data) {
      const FilesList = res.data.data.fileList
      const files = FilesList
        ? Object.keys(FilesList).map((key) => ({
            value: FilesList[key].id,
            label: FilesList[key].file_name,
          }))
        : ''
      setFiles(files)
    }
  }
  // useEffect(() => {
  //   if (curDataname != '') {
  //     loadFiles(curDataname)
  //   }
  // }, curDataname)

  //表单关系选择
  const changeRelationUpdate = (value) => {
    console.log(`selected ${value}`)
  }
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  const goUpdate = () => {
    setOpen(false)
  }
  //加载相关数据
  useEffect(() => {
    loadDataSetList()
    //获取任务类型列表
    loadTaskTypeList()
    //获取实体类型列表
    loadEntityList()
    //获取关系类型列表
    loadRelationList()
  }, [])
  //选择数据类型：
  const dataTypes = [
    {
      value: 'txt',
      label: '文本',
    },
    {
      value: 'img',
      label: '图片',
    },
    {
      value: 'video',
      label: '视频',
    },
    {
      value: 'audio',
      label: '音频',
    },
  ]
  const changeFileUpdate = () => {}
  //初始化表单
  const initForm = taskInfo
    ? {
        status: taskInfo.isFinish,
        dataType: taskInfo.dataType,
        entities: taskInfo.entities,
        relations: taskInfo.relations,
        files: taskInfo.files,
      }
    : {}
  //详情信息
  const items = taskInfo
    ? [
        {
          key: 'taskId',
          label: '任务ID',
          children: id,
          span: 1.5,
        },
        {
          key: 'taskName',
          label: '任务名称',
          children: taskInfo.taskName,
          span: 1.5,
        },
        {
          key: 'taskDataset',
          label: '任务数据集',
          children: taskInfo.taskDataset,
          span: 1.5,
        },
        {
          key: 'taskType',
          label: '任务类型',
          children: taskInfo.taskType,
          span: 1.5,
        },
        {
          key: 'dataType',
          label: '标注数据类型',
          children: taskInfo.dataType,
          span: 1.5,
        },
        {
          key: 'isFinish',
          label: '标注状态',
          children: taskInfo.isFinish ? (
            <Badge status="success" text="Success" />
          ) : (
            <Badge status="processing" text="Processing" />
          ),
          span: 1.5,
        },
        {
          key: 'entities',
          label: '标注实体',
          children: (
            <div>
              {taskInfo.entities.map((entity, index) => {
                const color = colors[index % colors.length]
                return (
                  <Tag key={index} color={color}>
                    {entity}
                  </Tag>
                )
              })}
            </div>
          ),
          span: 3,
        },
        {
          key: 'relations',
          label: '标注关系',
          children: (
            <div>
              {taskInfo.relations.map((relation, index) => {
                const color = colors[index % colors.length]
                return (
                  <Tag key={index} color={color}>
                    {relation}
                  </Tag>
                )
              })}
            </div>
          ),
          span: 3,
        },
        {
          key: 'files',
          label: '标注文件',
          children: (
            <div>
              {taskInfo.files.map((file, index) => {
                const color = colors[index % colors.length]
                return (
                  <Tag key={index} color={color}>
                    {file}
                  </Tag>
                )
              })}
            </div>
          ),
          span: 3,
        },
        {
          key: 'fileTotal',
          label: '文件数量',
          children: taskInfo.fileTotal,
          span: 1.5,
        },
        {
          key: 'taskUser',
          label: '任务负责人',
          children: taskInfo.taskUser,
          span: 1.5,
        },
        {
          key: 'createTime',
          label: '创建时间',
          children: moment(taskInfo.createTime).format('YYYY-MM-DD HH:mm:ss'),
          span: 2,
        },
        {
          key: 'createUser',
          label: '创建用户',
          children: taskInfo.createUser,
        },
        {
          key: 'updateTime',
          label: '更新时间',
          children: moment(taskInfo.updateTime).format('YYYY-MM-DD HH:mm:ss'),
          span: 2,
        },
        {
          key: 'updateUser',
          label: '更新用户',
          children: taskInfo.updateUser,
        },
        {
          key: 'createMonth',
          label: '创建年/月',
          children: taskInfo.createMonth,
          span: 1,
        },
        {
          key: 'createWeek',
          label: '创建年/周',
          children: taskInfo.createWeek,
          span: 1,
        },
        {
          key: 'createDay',
          label: '创建年/月/日',
          children: taskInfo.createDay,
          span: 1,
        },
        {
          key: 'taskDesc',
          label: '任务描述',
          children: taskInfo.taskDesc,
          span: 3,
        },
      ]
    : []

  return (
    <div>
      <Descriptions title="标注任务详情" bordered items={items} />
      <Space>
        <Button styles={{ margin: '10px' }} onClick={showDrawer}>
          修改
        </Button>
        <Drawer
          title="修改信息"
          width={720}
          onClose={onClose}
          open={open}
          bodyStyle={{
            paddingBottom: 80,
          }}
          extra={
            <Space>
              <Button onClick={goUpdate} type="primary">
                提交修改
              </Button>
            </Space>
          }>
          <Form layout="vertical" hideRequiredMark initialValues={initForm}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="taskNameUpdate"
                  label="任务名称"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter user name',
                    },
                  ]}>
                  <Input defaultValue={taskInfo ? taskInfo.taskName : ''} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="taskDatasetUpdate"
                  label="任务数据集"
                  rules={[
                    {
                      required: true,
                      message: 'Please select an owner',
                    },
                  ]}>
                  <Select
                    // onChange={onChangeDatasetName}
                    placeholder="Please select an owner"
                    showSearch
                    defaultValue={taskInfo ? taskInfo.taskDataset : ''}
                    options={dataNames}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="taskTypeUpdate"
                  label="任务类型"
                  rules={[
                    {
                      required: true,
                      message: 'Please select an owner',
                    },
                  ]}>
                  <Select
                    placeholder="Please select an owner"
                    showSearch
                    defaultValue={taskInfo ? taskInfo.taskType : ''}
                    options={typeNames}></Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dataType"
                  label="标注数据类型"
                  rules={[
                    {
                      required: true,
                      message: 'Please choose the type',
                    },
                  ]}>
                  <Select options={dataTypes}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="是否完成"
                  rules={[
                    {
                      required: true,
                      message: 'Please choose the approver',
                    },
                  ]}>
                  <Radio.Group onChange={onChangeStatus}>
                    <Radio value={false}>未完成</Radio>
                    <Radio value={true}>完成</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="entities"
                  label="标注实体"
                  rules={[
                    {
                      required: true,
                      message: 'Please choose the approver',
                    },
                  ]}>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{
                      width: '100%',
                    }}
                    placeholder="Please select"
                    onChange={changeEntityUpdate}
                    options={entitys}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="relations"
                  label="标注关系"
                  rules={[
                    {
                      required: true,
                      message: 'Please choose the approver',
                    },
                  ]}>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{
                      width: '100%',
                    }}
                    placeholder="Please select"
                    onChange={changeRelationUpdate}
                    options={relations}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="files"
                  label="标注文件"
                  rules={[
                    {
                      required: true,
                      message: 'Please choose the approver',
                    },
                  ]}>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{
                      width: '100%',
                    }}
                    placeholder="Please select"
                    onChange={changeFileUpdate}
                    options={files}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: 'please enter url description',
                    },
                  ]}>
                  <Input.TextArea
                    rows={4}
                    placeholder="please enter url description"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </Space>
    </div>
  )
}

export default TaskInfo
