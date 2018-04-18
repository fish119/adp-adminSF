import { getAllMenus, saveMenu, deleteMenu } from '../services/api';

export default {
  namespace: 'menu',

  state: {
    data: {
      list: [],
      userMenus: [],
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getAllMenus);
      yield put({ type: 'save', payload: response });
    },
    *saveMenu({ payload, callback }, { call, put }) {
      const response = yield call(saveMenu, payload);
      if (response) {
        yield put({ type: 'save', payload: response });
      }
      if (callback && response) {
        yield callback(response);
      }
    },
    *deleteMenu({ payload, callback }, { call, put }) {
      const response = yield call(deleteMenu, payload);
      if (response) {
        yield put({ type: 'save', payload: response });
      }
      if (callback && response) {
        yield callback(response);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: { list: action.payload.data },
        userMenus: action.payload.userMenus,
      };
    },
  },
};
