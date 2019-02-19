import { param2Obj } from '@/utils'
const userMap = {
  admin: {
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
