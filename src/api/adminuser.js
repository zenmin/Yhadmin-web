import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/admin/getAll',
    method: 'get',
    params: query
  })
}

export function getByCondition(query) {
  return request({
    url: '/api/admin/getByCondition',
    method: 'post',
    data: query
  })
}

export function save(data) {
  return request({
    url: '/api/admin/save',
    method: 'post',
    data: data
  })
}

export function updatePwd(data) {
  return request({
    url: '/api/admin/updatePwd',
    method: 'post',
    data: data
  })
}

export function deleteById(id) {
  return request({
    url: '/api/admin/delete',
    method: 'post',
    data: id
  })
}
