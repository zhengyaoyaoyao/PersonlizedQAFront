import { makeAutoObservable } from "mobx"
import { http } from '../utils'
import { role } from '../utils/authFunction'
class UserStore {
  userInfo = {}
  init = false
  constructor() {
    makeAutoObservable(this)
  }
  getUserInfo = async () => {
    const res = await http.get('/user/profile')
    role.updatePermissions(res.data.data.authority)

    this.userInfo = res.data.data

    this.init = true
  }
}
export default UserStore