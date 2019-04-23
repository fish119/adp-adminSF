import {
  checkUsername as asyncCheckUsername,
  checkNickname as asyncCheckNickname,
  checkPhone as asyncCheckPhone,
  checkEmail as asyncCheckEmail,
} from '../services/user';

export function checkUsername(rule, value, callback, id) {
  if (value) {
    asyncCheckUsername(value, id).then(response => {
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
export function checkNickname(rule, value, callback, id) {
  if (value) {
    asyncCheckNickname(value, id).then(response => {
      if (response.data) {
        callback();
      } else {
        callback('昵称已存在');
      }
    });
  } else {
    callback();
  }
}
export function checkPhone(rule, value, callback, id) {
  if (value) {
    asyncCheckPhone(value, id).then(response => {
      if (response.data) {
        callback();
      } else {
        callback('手机号码已存在');
      }
    });
  } else {
    callback();
  }
}
export function checkEmail(rule, value, callback, id) {
  if (value) {
    asyncCheckEmail(value, id).then(response => {
      if (response.data) {
        callback();
      } else {
        callback('Email已存在');
      }
    });
  } else {
    callback();
  }
}
