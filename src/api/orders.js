import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/orders/getAll',
    method: 'get',
    params: query
  })
}

export function getByCondition(query) {
  return request({
    url: '/api/orders/getByCondition',
    method: 'post',
    data: query
  })
}

export function getCouponByCondition(query) {
  return request({
    url: '/api/coupon/getByCondition',
    method: 'post',
    data: query
  })
}
