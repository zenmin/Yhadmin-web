import request from '@/utils/request'

export function save(query) {
  return request({
    url: '/api/interfaceConfig/save',
    method: 'post',
    data: query
  })
}

export function getByCondition(query) {
  return request({
    url: '/api/interfaceConfig/getByCondition',
    method: 'post',
    data: query
  })
}

