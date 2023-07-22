import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

const Chart = ({ title, xData, yData, style }) => {
  const domRef = useRef()
  const chartInit = () => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(domRef.current)
    myChart.setOption({
      title: {
        text: title,
      },
      tooltip: {},
      xAxis: {
        data: xData,
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: yData,
        },
      ],
    })
  }
  useEffect(() => {
    chartInit()
  })
  return (
    <div>
      <div ref={domRef} style={style}></div>
    </div>
  )
}

export default Chart
