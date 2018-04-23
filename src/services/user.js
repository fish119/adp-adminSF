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

export async function checkUsername(username) {
  return request(`api/user/checkUsernameUnique?username=${username}`, { method: 'GET' });
}

export async function checkNickname(nickname) {
  return request(`api/user/checkNicknameUnique?nickname=${nickname}`, { method: 'GET' });
}