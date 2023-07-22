import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  HomeOutlined,
  LogoutOutlined,
  BarsOutlined,
} from '@ant-design/icons'
import Home from '../pages/Home'
import DataTask from '../pages/DataTask'
import Files from '../pages/Files'
import DataManage from '../pages/DataManage'
import NotPermissions from '../pages/NotPermissions'
import TaskType from '../pages/TaskTpye'
import EntityManage from '../pages/EntityManage'
import RelationManage from '../pages/RelationManage'
import UserManage from '../pages/UserManage'
import TaskInfo from '../pages/TaskInfo'
import Task from '../pages/Task'
import { EPermission, hasPermission } from '../utils/authFunction'
import { cloneDeepWith } from 'lodash'
import { Navigate } from 'react-router-dom'
import DataFile from '../pages/DataFile'
import TaskNew from '../pages/TaskNew'
import InfoSource from '../pages/InfoSource'
import TaskFiles from '../pages/TaskFiles'
import Log from '../pages/Log'

export const usePageRoutes = () => {
  const routes = [
    //首页
    {
      title: '首页',
      path: '/home',
      icon: <HomeOutlined />,
      element: <Home />,
      permission: EPermission.MenuHome,
    },
    //标注任务
    {
      title: '标注任务',
      path: '/datatask',
      icon: <LaptopOutlined />,
      element: <DataTask></DataTask>,
      permission: EPermission.MenuAnnotationTask,
      subRoute: [
        {
          path: '/taskNew',
          element: <TaskNew></TaskNew>,
        },
        {
          path: '/taskinfo/',
          element: <TaskInfo></TaskInfo>,
        },
      ],
    },
    //数据集列表
    {
      title: '数据集列表',
      path: '/dataset',
      icon: <NotificationOutlined />,
      element: <DataFile></DataFile>,
      permission: EPermission.MenuDataset,
    },
    //文件列表
    {
      title: '文件列表',
      path: '/files',
      icon: <LogoutOutlined />,
      element: <Files></Files>,
      permission: EPermission.MenuFiles,
    },
    //数据管理
    {
      title: '数据管理',
      path: '/datamanage',
      icon: <NotificationOutlined />,
      element: <DataManage></DataManage>,
      permission: EPermission.MenuData,
    },
    //任务类型管理
    {
      title: '任务类型管理',
      path: '/tasktype',
      icon: <NotificationOutlined />,
      element: <TaskType></TaskType>,
      permission: EPermission.MenuTaskType,
    },
    //实体管理
    {
      title: '实体管理',
      path: '/entity',
      icon: <NotificationOutlined />,
      element: <EntityManage></EntityManage>,
      permission: EPermission.MenuEntity,
    },
    //关系管理
    {
      title: '关系管理',
      path: '/relation',
      icon: <NotificationOutlined />,
      element: <RelationManage></RelationManage>,
      permission: EPermission.MenuRelations,
    },
    //任务管理
    {
      title: '采集任务管理',
      path: '/task',
      icon: <BarsOutlined />,
      element: <Task></Task>,
      permission: EPermission.MenuTask,
      subRoute: [
        {
          path: '/taskfiles/',
          element: <TaskFiles></TaskFiles>,
        },
      ],
    },
    //信源列表
    {
      title: '信源列表',
      path: '/infosource',
      icon: <BarsOutlined />,
      element: <InfoSource></InfoSource>,
      permisson: EPermission.MenuInfoSouce,
    },
    //成员管理
    {
      title: '成员管理',
      path: '/user',
      icon: <NotificationOutlined />,
      element: <UserManage></UserManage>,
      permission: EPermission.MenuUserManage,
    },
    //日志管理
    {
      title: '日志管理',
      path: '/log',
      icon: <NotificationOutlined />,
      element: <Log></Log>,
      permission: EPermission.MenuLog,
    },
    //无权限页面
    {
      path: '/403',
      hidMenu: true,
      icon: <NotificationOutlined />,
      element: <NotPermissions />,
    },
  ]
  const toPermissionRoutes = (routes) => {
    //处理真实路由，地址栏的跳转
    const _map = (routes) => {
      return routes.map((item) => {
        //如果没有权限限制，那么就直接返回，即肯定会显示
        if (!item.permission) {
          return item
        }
        //如果这个人没有这个权限，那如果访问了就跳转login
        if (!hasPermission(item.permission)) {
          item.element = <Navigate to="/403" replace />
        }
        //子菜单就递归
        if (item.subRoute && item.subRoute.length) {
          item.subRoute = _map([...item.subRoute])
        }
        return item
      })
    }
    //处理菜单路由，即是否要显示这个菜单。
    const _filter = (routes) => {
      return routes.filter((item) => {
        //如果有菜单是隐藏的，那么就返回false
        if (item.hidMenu) {
          return false
        }
        //如果有二级目录，还是递归
        if (item.subRoute && item.subRoute.length) {
          item.subRoute = _filter([...item.subRoute])
        }
        //没有权限限制，并且标题是字符串的话，或者没有标题
        if (!item.permission && typeof item.title === 'string') {
          return true
        }
        //其他的就是有权限的标签，那么是否要显示就是看是否存在这个权限
        const result = hasPermission(item.permission)
        return hasPermission(item.permission)
      })
    }
    //真实路由渲染
    const realRoutes = _map(
      cloneDeepWith(routes, (value, key) => {
        if (key === 'element' || key === 'icon') {
          return value
        }
      })
    )
    //
    const menuRoutes = _filter(routes)

    return {
      realRoutes: realRoutes,
      menuRoutes: menuRoutes,
    }
  }

  //转换为真实路由的格式,主要为了处理二级路由
  const toRealRoutes = (routes) => {
    const _routes = []
    routes.map((item) => {
      if (item?.subRoute) {
        item.subRoute.map((subItem) => {
          subItem.path = item.path + String(subItem.path)
          _routes.push(subItem)
        })
      }
      _routes.push(item)
    })
    return _routes
  }
  //转换为真实菜单的格式：
  const toRealMenus = (routes) => {
    return routes.map((item) => {
      if (item.subRoute) {
        item.subRoute.map((subItem) => {
          subItem.path = item.path + String(subItem.path)
        })
      }
      return item
    })
  }
  const permissionRoutes = toPermissionRoutes(routes) //处理地址访问和菜单访问,然后处理二级
  const realRoutes = toRealRoutes(permissionRoutes.realRoutes) //处理二级访问
  const menuRoutes = toRealMenus(permissionRoutes.menuRoutes) //处理菜单二级访问
  return {
    toPermissionRoutes,
    permissionRoutes,
    menuRoutes,
    realRoutes,
    routes,
  }
}
