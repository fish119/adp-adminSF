import { getAllMenus } from '../services/api';

export default {
  namespace: 'menu',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getAllMenus);
      yield put({ type: 'save', payload: response });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {list:action.payload.data},
      };
    },
  },
};
