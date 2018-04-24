import { query as queryUsers, queryCurrent ,saveUser,deleteUser} from '../services/user';

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentUser: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.user,
      });
    },
    *saveUser({ payload, callback }, { call, put }) {
      const response = yield call(saveUser, payload);
      if (response) {
        yield put({ type: 'save', payload: response });
      }
      if (callback&&response) {
        yield callback();
      }
    },
    *deleteUser({ payload, callback }, { call, put }) {
      const response = yield call(deleteUser, payload);
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
        data: {
          list: action.payload.data.content,
          pagination: {
            total: action.payload.data.totalElements,
            pageSize: action.payload.data.pageable.pageSize,
            current: action.payload.data.pageable.pageNumber + 1,
          },
        },
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
