// use localStorage to store the authority info, which might be sent from server in actual
// project.
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority') || 'guest';
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  return localStorage.setItem('token',token);
}

export function clearToken(){
  return localStorage.removeItem('token');
}
