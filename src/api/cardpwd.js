import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/card/getAll',
    method: 'get',
    params: query
  })
}

export function getByCondition(query) {
  return request({
    url: '/api/card/getByCondition',
    method: 'post',
    data: query
  })
}

export function save(data) {
  return request({
    url: '/api/card/save',
    method: 'post',
    data: data
  })
}

export function deleteById(id) {
  return request({
    url: '/api/card/delete',
    method: 'post',
    data: id
  })
}
export function deleteBatch(type) {
  return request({
    url: '/api/card/deleteBatch',
    method: 'post',
    data: type
  })
}
