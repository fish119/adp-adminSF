import { changePassword, saveProfile } from '../services/user';

export default {
  namespace: 'profile',

  state: {
    currentUser: {},
  },
  effects: {
    *changePassword({ payload, callback }, { call }) {
      const response = yield call(changePassword, payload);
      if (callback && response) {
        yield callback();
      }
    },
    *saveProfile({ payload, callback }, { call }) {
      const response = yield call(saveProfile, payload);
      if (callback && response) {
        yield callback(response);
      }
    },
  },
  reducers: {},
};
