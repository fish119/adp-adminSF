import { getAllAuthorities, saveAuthority, deleteAuthority } from '../services/api';

export default {
  namespace: 'authority',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getAllAuthorities);
      yield put({ type: 'save', payload: response });
    },
    *saveAuthority({ payload, callback }, { call, put }) {
      const response = yield call(saveAuthority, payload);
      if (response) {
        yield put({ type: 'save', payload: response });
      }
      if (callback) {
        yield callback();
      }
    },
    *deleteAuthority({ payload, callback }, { call, put }) {
      const response = yield call(deleteAuthority, payload);
      if (response) {
        yield put({ type: 'save', payload: response });
      }
      if (callback) {
        yield callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: { list: action.payload.data },
      };
    },
  },
};
