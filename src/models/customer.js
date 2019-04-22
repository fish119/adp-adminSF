import {
  getCustomers,
  getCustomer,
  saveCustomer,
  deleteCustomer,
} from '../services/api';

export default {
  namespace: 'customer',
  state: {
    data: {
      customers: {
        list: [],
        pagination: {},
      },
      customer: {},
    },
  },
  effects: {
    *fetchCustomer(_, { call, put }) {
      const response = yield call(getCustomers);
      yield put({ type: 'saveCustomers', payload: response });
    },
    *saveCustomerId({ payload }, { put }) {
      yield put({
        type: 'setCustomerid',
        payload,
      });
    },
    *getCustomer({ payload, callback }, { call, put }) {
      const response = yield call(getCustomer, payload);
      if (callback && response) {
        yield callback(response);
      }
      yield put({
        type: 'saveCustomer',
        payload: response,
      });
    },
    *setNewCustomer({ payload }, { put }) {
      yield put({
        type: 'saveNewCustomer',
        payload,
      });
    },
    *postCustomer({ payload, callback }, { call, put }) {
      const response = yield call(saveCustomer, payload);
      if (response) {
        yield put({ type: 'saveCustomer', payload: response });
      }
      if (callback && response) {
        yield callback();
      }
    },
    *deleteCustomer({ payload, callback }, { call, put }) {
      const response = yield call(deleteCustomer, payload);
      if (response) {
        yield put({ type: 'saveCustomer', payload: response });
      }
      if (callback && response) {
        yield callback();
      }
    },
  },
  reducers: {
    saveCustomers(state, action) {
      const dt = {
        ...state.data,
        customers: {
          list: action.payload.data,
        },
      };
      return {
        ...state,
        data: dt,
      };
    },
    setCustomerid(state, action) {
      return {
        ...state,
        customerid: action.payload,
      };
    },
    saveCustomer(state, action) {
      const dt = {
        ...state.data,
        customer: action.payload.data,
      };
      return {
        ...state,
        data: dt,
      };
    },
    saveNewCustomer(state, action) {
      const dt = {
        ...state.data,
        customer: action.payload,
      };
      return {
        ...state,
        data: dt,
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/customer/customer/edit' && query && query.id > 0) {
          dispatch({ type: 'saveCustomerId', payload: query.id });
        } else {
          dispatch({ type: 'saveCustomerId', payload: -1 });
        }
      });
    },
  },
};
