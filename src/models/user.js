import {
  query as queryUsers,
  queryCurrent,
  checkUsername as asyncCheckUsername,
  checkNickname as asyncCheckNickname,
  checkPhone as asyncCheckPhone,
  checkEmail as asyncCheckEmail,
} from '../services/user';

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
    *checkUsername({ payload }, { call }) {
      const response = yield call(asyncCheckUsername, payload);
      return response;
    },
    *checkNickname({ payload }, { call }) {
      const response = yield call(asyncCheckNickname, payload);
      return response;
    },
    *checkEmail({ payload }, { call }) {
      const response = yield call(asyncCheckEmail, payload);
      return response;
    },
    *checkPhone({ payload }, { call }) {
      const response = yield call(asyncCheckPhone, payload);
      return response;
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
