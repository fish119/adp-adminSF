import md5 from 'js-md5';
import { routerRedux } from 'dva/router';
import { setAuthority, setToken, clearToken } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { login } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const param = {
        username: payload.username,
        password: md5(payload.password),
      };
      const response = yield call(login, param);
      const atoken = response && response.token ? response.token : null;
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
          currentAuthority: 'user',
          token: atoken,
        },
      });
      // Login successfully
      if (response && response.token) {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });

      reloadAuthorized();
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const currentAuthority =
        payload && payload.currentAuthority ? payload.currentAuthority : 'guest';
      const astatus = (payload && payload.status) != null ? payload.status : 'error';
      setAuthority(currentAuthority);

      if (astatus === 'ok' && payload.token) {
        setToken('fish119'.concat(payload.token));
      }
      if (!astatus) {
        clearToken();
      }
      return {
        ...state,
        status: astatus,
        type: 'account',
      };
    },
  },
};
