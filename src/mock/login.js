import { param2Obj } from '@/utils'
const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '超级管理员',
    avatar: '/src/icons/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  }
}

export default {
  loginByUsername: config => {
    return userMap['admin']
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success'
}
