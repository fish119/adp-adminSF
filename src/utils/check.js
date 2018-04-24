import {
  checkUsername as asyncCheckUsername,
  checkNickname as asyncCheckNickname,
  checkPhone as asyncCheckPhone,
  checkEmail as asyncCheckEmail,
} from '../services/user';

export function checkUsername(rule, value, callback) {
  if (value) {
    asyncCheckUsername(value).then(response => {
      if (response.data) {
        callback();
      } else {
        callback('用户名已存在');
      }
    });
  } else {
    callback();
  }
}
export function checkNickname(rule, value, callback) {
  if (value) {
    asyncCheckNickname(value).then(response => {
      if (response.data) {
        callback();
      }
      callback('昵称已存在');
    });
  } else {
    callback();
  }
}
export function checkPhone(rule, value, callback) {
  if (value) {
    asyncCheckPhone(value).then(response => {
      if (response.data) {
        callback();
      }
      callback('手机号码已存在');
    });
  } else {
    callback();
  }
}
export function checkEmail(rule, value, callback) {
  if (value) {
    asyncCheckEmail(value).then(response => {
      if (response.data) {
        callback();
      }
      callback('Email已存在');
    });
  } else {
    callback();
  }
}
