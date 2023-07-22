//定义权限枚举
export const EPermission = {
  MenuHome: '01001',
  MenuAnnotationTask: '02001',
  MenuDataset: '03001',
  MenuFiles: '04001',
  MenuData: '05001',
  MenuTaskType: '06001',
  MenuEntity: '07001',
  MenuRelations: '08001',
  MenuUserManage: '09001',
  MenuTask: '10001',
  MenuInfoSouce: '11001',
  MenuLog: '12001',
  ButtonTaskUpdate: '10002',
  ButtonTaskDelete: '10003',
  ButtonTaskNew: '10004',
  ActionTaskCheck: '10005',
  ButtonInfoSourceUpdate: '11002',
  ButtonInfoSourceDelete: '11003',
  ButtonInfoSourceNew: '11004',
}

//存储登录用户的权限信息
export const role = (function () {
  let _permissions = []

  return {
    updatePermissions (permissions) {
      _permissions = [...permissions]

    },

    getPermissions () {
      return _permissions
    },
  }
})()

export function hasPermission (permission) {
  const _permissions = role.getPermissions()
  if (Array.isArray(permission)) {
    return permission.some((value) => {
      return _permissions.includes(value)
    })
  } else {
    return _permissions.includes(permission)
  }
}
//检查权限并渲染组件
export function checkFunction (Component, permission) {
  if (hasPermission(permission)) {
    return Component
  } else {
    return null
  }
}
