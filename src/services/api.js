import request from '../utils/request';

export async function login(params) {
    return request('auth', {
        method: 'POST',
        body: params
    });
}

export async function getIndexData() {
    return request('global', {
      method: 'GET'
    });
  }