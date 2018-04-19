import { getAllDeparts, saveDepart, deleteDepart } from '../services/api';

export default {
  namespace: 'depart',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getAllDeparts);
      yield put({ type: 'save', payload: response });
    },
    *saveDepart({ payload, callback }, { call, put }) {
      const response = yield call(saveDepart, payload);
      if (response) {
        yield put({ type: 'save', payload: response });
      }
      if (callback&&response) {
        yield callback();
      }
    },
    *deleteDepart({ payload, callback }, { call, put }) {
      const response = yield call(deleteDepart, payload);
      if (response) {
        yield put({ type: 'save', payload: response });
      }
      if (callback&&response) {
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
