import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Select, Transfer, message } from 'antd'
import { http } from '../../utils'
import { useNavigate } from 'react-router-dom'
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
}
/* eslint-enable no-template-curly-in-string */

const TaskNew = () => {
  //上传等待
  const [uploading, setUploading] = useState(false)
  //选择数据集
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
  //选择文件，需要先确定数据集
  const [selectDataName, setSelectDataName] = useState('')
  const onChangeData = (value) => {
    console.log(`数据集选择： ${value}`)
    const taskDatasetValue = dataNames.find(
      (data) => data.value === value
    ).label
    setSelectDataName(taskDatasetValue)
  }
  const onSearchData = (value) => {
    console.log('数据集搜索:', value)
  }
  const [mockData, setMockData] = useState([])
  const [targetKeys, setTargetKeys] = useState([])
  const [fileNamesList, setFileNamesList] = useState([])
  //获取对应数据集的文件
  const loadFilesList = async () => {
    const res = await http.get('/files/getFilesNameListByDataName', {
      params: { selectDataName },
    })

    if (res.data.data) {
      setFileNamesList(res.data.data.fileNames)
    }
  }
  const getMock = () => {
    if (selectDataName) {
      loadFilesList()
      const tempTargetKeys = []
      const tempMockData = []
      const fileNames = fileNamesList ? fileNamesList : []
      for (let i = 0; i < fileNames.length; i++) {
        const data = {
          key: fileNames[i].id,
          title: fileNames[i].submitted_file_name,
          description: fileNames[i].submitted_file_name,
        }
        tempMockData.push(data)
      }
      setMockData(tempMockData)
      setTargetKeys(tempTargetKeys)
    }
  }
  useEffect(() => {
    getMock()
  }, [selectDataName])
  const filterOption = (inputValue, option) =>
    option.description.indexOf(inputValue) > -1
  const handleChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys)
  }
  const handleSearch = (dir, value) => {
    console.log('search:', dir, value)
  }
  //选择任务类型
  const [typeName, setTypeName] = useState()
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
      setTypeName(taskTypes)
    }
  }

  const onChangeTaskType = (value) => {
    //这里是可以拿到value值的，上传时候拿的是label
    console.log(`选择的任务类型 ${value}`)
  }
  const onSearchTaskType = (value) => {
    console.log('搜索任务类型:', value)
  }
  //标注文件类型选择：
  const onChangeFileType = (value) => {
    console.log(`选择的文件类型 ${value}`)
  }
  const onSearchFileType = (value) => {
    console.log('搜索的文件类型:', value)
  }
  //实体选择：
  const onChangeEntity = (value) => {
    console.log(`选择的实体类型 ${value}`)
  }
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
  //关系选择：
  const onChangeRelation = (value) => {
    console.log(`selected ${value}`)
  }
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
  useEffect(() => {
    //获得数据集
    loadDataSetList()
    //获取任务类型列表
    loadTaskTypeList()
    //获取实体类型列表
    loadEntityList()
    //获取关系类型列表
    loadRelationList()
  }, [])
  //表单提交
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const onFinish = async (values) => {
    setUploading(true)
    console.log(values)
    const formData = new FormData()
    formData.append('taskName', values.taskName)
    formData.append('taskDatasetId', values.taskDataset)
    formData.append('annotationFilesId', values.annotationFiles)
    formData.append('taskTypeId', values.taskType)
    formData.append('dataType', values.dataType)
    formData.append('entityList', values.entity)
    formData.append('relationList', values.relation)
    formData.append('taskRule', values.taskRule)
    formData.append('taskDesc', values.taskDesc)
    formData.append('taskUser', values.mainUser)
    try {
      const response = await http.post('/annotationtask/insert', formData)

      if (response.data.data) {
        message.success('新建成功')
        navigate('/datatask')
      } else {
        message.error('新建失败')
      }
    } catch (error) {
      message.error('新建失败')
    } finally {
      setUploading(false)
    }
  }
  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
      validateMessages={validateMessages}
      form={form}>
      <Form.Item
        name={'taskName'}
        label="标注任务名称"
        rules={[
          {
            required: true,
          },
        ]}>
        <Input />
      </Form.Item>

      <Form.Item
        name={'taskDataset'}
        label="标注数据集"
        rules={[
          {
            required: true,
          },
        ]}>
        <Select
          showSearch
          placeholder="选择数据集"
          optionFilterProp="children"
          onChange={onChangeData}
          onSearch={onSearchData}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={dataNames}
        />
      </Form.Item>
      {selectDataName ? (
        <Form.Item
          name={'annotationFiles'}
          label="标注文件选择"
          rules={[
            {
              required: true,
            },
          ]}>
          <Transfer
            dataSource={mockData}
            showSearch
            filterOption={filterOption}
            targetKeys={targetKeys}
            onChange={handleChange}
            onSearch={handleSearch}
            render={(item) => item.title}
          />
        </Form.Item>
      ) : (
        ''
      )}
      <Form.Item name={'taskType'} label="任务类型">
        <Select
          showSearch
          placeholder="选择任务类型"
          optionFilterProp="children"
          onChange={onChangeTaskType}
          onSearch={onSearchTaskType}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={typeName}
        />
      </Form.Item>
      <Form.Item name={'dataType'} label="标注文件类型">
        <Select
          showSearch
          placeholder="选择标注类型"
          optionFilterProp="children"
          onChange={onChangeFileType}
          onSearch={onSearchFileType}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[
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
          ]}
        />
      </Form.Item>
      <Form.Item name={'entity'} label="实体类型选择">
        <Select
          mode="multiple"
          style={{
            width: '100%',
          }}
          placeholder="请选择标注的实体"
          onChange={onChangeEntity}
          options={entitys}
        />
      </Form.Item>
      <Form.Item name={'relation'} label="关系类型选择">
        <Select
          mode="multiple"
          style={{
            width: '100%',
          }}
          placeholder="请选择标注的关系"
          onChange={onChangeRelation}
          options={relations}
        />
      </Form.Item>
      <Form.Item name={'taskRule'} label="任务规则">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name={'taskDesc'} label="任务描述">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name={'mainUser'} label="项目负责人">
        <Input />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          ...layout.wrapperCol,
          offset: 8,
        }}>
        <Button type="primary" htmlType="submit" loading={uploading}>
          {uploading ? '上传中' : '新建'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default TaskNew
