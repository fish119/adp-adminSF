import request from '../utils/request';

export async function login(params) {
  return request('auth', {
    method: 'POST',
    body: params,
  });
}

export async function getIndexData() {
  return request('global', {
    method: 'GET',
  });
}

export async function getAllMenus() {
  return request('setting/menus', {
    method: 'GET',
  });
}
