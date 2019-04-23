import { getAllRoles, saveRole, deleteRole } from '../services/api';

export default {
  namespace: 'role',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getAllRoles);
      yield put({ type: 'save', payload: response });
    },
    *saveRole({ payload, callback }, { call, put }) {
      const response = yield call(saveRole, payload);
      if (response) {
        yield put({ type: 'save', payload: response });
      }
      if (callback && response) {
        yield callback();
      }
    },
    *deleteRole({ payload, callback }, { call, put }) {
      const response = yield call(deleteRole, payload);
      if (response) {
        yield put({ type: 'save', payload: response });
      }
      if (callback && response) {
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
