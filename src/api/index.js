import request from '@/utils/request'

export function getDashboard() {
  return request({
    url: '/api/index/getDashboard',
    method: 'get',
    params: null
  })
}

export function getPayway(query) {
  return request({
    url: '/api/index/getPayway',
    method: 'post',
    data: query
  })
}

export function getNowOrder(query) {
  return request({
    url: '/api/index/getNowOrder',
    method: 'post',
    data: query
  })
}
