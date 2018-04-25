import request from '../utils/request';

export async function query(param) {
  let url = `setting/users?currentPage=${
    param && param.currentPage ? param.currentPage : 0
  }&pageSize=${param && param.pageSize ? param.pageSize : 10}`;
  if (param && param.searchStr) {
    url += `&searchStr=${param.searchStr}`;
  }
  if (param && param.department) {
    url += `&department=${param.department}`;
  }
  return request(url, {
    method: 'GET',
  });
}

export async function queryCurrent() {
  return request('setting/profile');
}

export async function checkUsername(username,id) {
  return request(`api/user/checkUsernameUnique?username=${username}&id=${id}`, { method: 'GET' });
}

export async function checkNickname(nickname,id) {
  return request(`api/user/checkNicknameUnique?nickname=${nickname}&id=${id}`, { method: 'GET' });
}

export async function checkPhone(phone,id) {
  return request(`api/user/checkPhoneUnique?phone=${phone}&id=${id}`, { method: 'GET' });
}

export async function checkEmail(email,id) {
  return request(`api/user/checkEmailUnique?email=${email}&id=${id}`, { method: 'GET' });
}

export async function saveUser(params) {
  return request('setting/users', {
    method: 'POST',
    body: params,
  });
}

export async function deleteUser(params) {
  return request(`setting/user/${params}`, {
    method: 'DELETE',
  });
}

export async function setDefaultPassword(params) {
  return request('setting/users/setDefaultPassword', {
    method: 'POST',
    body: params,
  });
}

export async function changePassword(params) {
  return request('setting/profile/changePassword', {
    method: 'POST',
    body: params,
  });
}

export async function saveProfile(params) {
  return request('setting/profile', {
    method: 'POST',
    body: params,
  });
}