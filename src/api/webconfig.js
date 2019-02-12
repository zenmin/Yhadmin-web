import request from '@/utils/request'

export function get() {
  return request({
    url: '/api/webConfig/getAll',
    method: 'post',
    params: null
  })
}

export function save(data) {
  return request({
    url: '/api/webConfig/save',
    method: 'post',
    data: data
  })
}
