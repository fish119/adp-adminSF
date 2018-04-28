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

export async function getAllArticleCategories() {
  return request('article/categories', {
    method: 'GET',
  });
}

export async function saveArticleCategory(params) {
  return request('article/category', {
    method: 'POST',
    body: params,
  });
}

export async function deleteArticleCategory(params) {
  return request(`article/category/${params}`, {
    method: 'DELETE',
  });
}

export async function queryArticles(param) {
  let url = `article/articles?currentPage=${
    param && param.currentPage ? param.currentPage : 0
  }&pageSize=${param && param.pageSize ? param.pageSize : 10}`;
  if (param && param.searchStr) {
    url += `&searchStr=${param.searchStr}`;
  }
  if (param && param.category) {
    url += `&category=${param.category}`;
  }
  return request(url, {
    method: 'GET',
  });
}

export async function geArticle(id) {
  return request(`article/article/${id}`, {
    method: 'GET',
  });
}

export async function saveArticle(params) {
  return request('article/articles', {
    method: 'POST',
    body: params,
  });
}