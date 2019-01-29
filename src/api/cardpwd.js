import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/goods/getAll',
    method: 'get',
    params: query
  })
}

export function getByCondition(query) {
  return request({
    url: '/api/goods/getByCondition',
    method: 'post',
    data: query
  })
}

export function save(data) {
  return request({
    url: '/api/goods/save',
    method: 'post',
    data: data
  })
}

export function deleteById(id) {
  return request({
    url: '/api/goods/delete',
    method: 'post',
    data: id
  })
}
