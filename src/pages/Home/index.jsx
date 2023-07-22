// import Chart from '../../components/charts'
import * as echarts from 'echarts'
import { useEffect, useRef, useState } from 'react'
import { Layout } from 'antd'
import { http } from '../../utils'
const { Content } = Layout
const Home = () => {
  //获得任务完成情况
  const [taskData, setTaskData] = useState()
  const taskInfo = async () => {
    const response = await http.get('/home/taskInfo')
    if (response.data.data) {
      const result = response.data.data
      setTaskData([
        {
          value: result.success,
          name: '已完成',
        },
        {
          value: result.unsuccess,
          name: '未完成',
        },
      ])
      console.log(result)
    }
  }
  const domRef = useRef()
  const chartInit = () => {
    const option = {
      title: {
        text: '任务完成情况',
        left: 'center',
      },
      legend: {
        bottom: 10,
        left: 'center',
        data: ['已完成', '未完成'],
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          data: taskData,
        },
      ],
    }
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(domRef.current)
    myChart.setOption(option)
  }
  useEffect(() => {
    chartInit()
  })
  useEffect(() => {
    taskInfo()
  }, [])
  return (
    <div>
      <Layout className="main">
        <Content className="content">
          <div ref={domRef} style={{ width: '400px', height: '300px' }}></div>
        </Content>
      </Layout>
    </div>
  )
}

export default Home
