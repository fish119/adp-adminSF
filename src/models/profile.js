import { changePassword } from '../services/user';

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
  },
  reducers: {},
};
