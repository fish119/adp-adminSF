import request from '../utils/request';

export async function query() {
  return request('setting/users');
}

export async function queryCurrent() {
  return request('setting/profile');
}
