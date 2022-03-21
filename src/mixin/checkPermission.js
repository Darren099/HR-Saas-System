// 做一个混入对象
// 哪个按钮需要权限就放在哪个按钮那里
import store from '@/store'

export default {
  methods: {
    checkPermission(key) {
      // 去用户信息里面找points中有没有key，如果有key则认为有权限，没有则认为不能点击
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
