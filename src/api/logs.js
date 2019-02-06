import request from '@/utils/request'

export function optList(query) {
  return request({
    url: '/api/log/getOptAll',
    method: 'get',
    params: query
  })
}

export function getByCondition(query) {
  return request({
    url: '/api/log/getOptCondition',
    method: 'post',
    data: query
  })
}

export function accessList(query) {
  return request({
    url: '/api/log/getAccessLog',
    method: 'get',
    params: query
  })
}

export function getAccessLogCondition(query) {
  return request({
    url: '/api/log/getAccessLogCondition',
    method: 'post',
    data: query
  })
}

export function getCardpwd(data) {
  return request({
    url: '/api/log/get_del_cardpwd',
    method: 'post',
    data: data
  })
}

