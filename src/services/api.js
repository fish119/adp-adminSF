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

export async function saveMenu(params) {
  const a = request('setting/menus', {
    method: 'POST',
    body: params,
  });
  return a;
}
