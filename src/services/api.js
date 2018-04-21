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
  return request('setting/menus', {
    method: 'POST',
    body: params,
  });
}

export async function deleteMenu(params) {
  return request(`setting/menu/${params}`, {
    method: 'DELETE',
  });
}

export async function getAllAuthorities() {
  return request('setting/authorities', {
    method: 'GET',
  });
}

export async function saveAuthority(params) {
  return request('setting/authorities', {
    method: 'POST',
    body: params,
  });
}

export async function deleteAuthority(params) {
  return request(`setting/authority/${params}`, {
    method: 'DELETE',
  });
}

export async function getAllDeparts() {
  return request('setting/departments', {
    method: 'GET',
  });
}

export async function saveDepart(params) {
  return request('setting/departments', {
    method: 'POST',
    body: params,
  });
}

export async function deleteDepart(params) {
  return request(`setting/department/${params}`, {
    method: 'DELETE',
  });
}

export async function getAllRoles() {
  return request('setting/roles', {
    method: 'GET',
  });
}

export async function saveRole(params) {
  return request('setting/roles', {
    method: 'POST',
    body: params,
  });
}

export async function deleteRole(params) {
  return request(`setting/role/${params}`, {
    method: 'DELETE',
  });
}