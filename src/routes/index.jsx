import { Suspense } from 'react'
import { Layout, Spin } from 'antd'
import { usePageRoutes } from './pageRoutes'
import { Route, Routes } from 'react-router-dom'

const { Content } = Layout
export const InnerRouters = () => {
  const { realRoutes } = usePageRoutes()
  return (
    <Suspense fallback={<Spin style={{ marginTop: '10%', width: '100%' }} />}>
      <Routes>
        {realRoutes.map((r) => {
          const { path, element } = r
          document.title = '数据采集平台'
          return (
            <Route
              key={path + ''}
              path={path}
              element={<Content>{element}</Content>}></Route>
          )
        })}
      </Routes>
    </Suspense>
  )
}
