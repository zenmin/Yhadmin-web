import request from '@/utils/request'

export function loginByUsername(username, password) {
  return request({
    // url: '/login/login',
    url: '/api/index/login',
    method: 'post',
    data: ''
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    // url: '/user/info',
    url: '/api/index/login',
    method: 'get',
    params: { token }
  })
}

