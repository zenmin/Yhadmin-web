import request from '@/utils/request'

export default {
  getCategories() {
    return request({
      url: '/api/category/getAll',
      method: 'get'
    })
  }
}

export function fetchList(query) {
  return request({
    url: '/api/category/getAll',
    method: 'get',
    params: query
  })
}

export function getByCondition(query) {
  return request({
    url: '/api/category/getByCondition',
    method: 'post',
    data: query
  })
}

export function save(data) {
  return request({
    url: '/api/category/save',
    method: 'post',
    data: data
  })
}

export function deleteById(id) {
  return request({
    url: '/api/category/delete',
    method: 'post',
    data: id
  })
}
