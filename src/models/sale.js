import { getSales, getSale, saveSale, deleteSale, getCustomers } from '../services/api';

export default {
  namespace: 'sale',
  state: {
    data: {
      customers: [],
      sales: {
        list: [],
        pagination: {},
      },
      sale: {},
    },
  },
  effects: {
    *fetchCustomers(_, { call, put }) {
      const response = yield call(getCustomers);
      yield put({ type: 'saveCustomers', payload: response });
    },

    *deleteSale({ payload, callback }, { call, put }) {
      const response = yield call(deleteSale, payload);
      if (response) {
        yield put({ type: 'saveSales', payload: response });
      }
      if (callback && response) {
        yield callback();
      }
    },
    *fetchSales({ payload }, { call, put }) {
      const response = yield call(getSales, payload);
      yield put({
        type: 'saveSales',
        payload: response,
      });
    },
    *saveSaleId({ payload }, { put }) {
      yield put({
        type: 'setSaleid',
        payload,
      });
    },
    *getSale({ payload, callback }, { call, put }) {
      const response = yield call(getSale, payload);
      if (callback && response) {
        yield callback(response);
      }
      yield put({
        type: 'saveSale',
        payload: response,
      });
    },
    *setNewSale({ payload }, { put }) {
      yield put({
        type: 'saveNewSale',
        payload,
      });
    },
    *postSale({ payload, callback }, { call, put }) {
      const response = yield call(saveSale, payload);
      if (response) {
        yield put({ type: 'saveSale', payload: response });
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
        customers: action.payload.data,
      };
      return {
        ...state,
        data: dt,
      };
    },
    saveSales(state, action) {
      const dt = {
        ...state.data,
        sales: {
          list: action.payload.data,
        },
      };
      return {
        ...state,
        data: dt,
      };
    },
    setSaleid(state, action) {
      return {
        ...state,
        saleid: action.payload,
      };
    },
    saveSale(state, action) {
      const dt = {
        ...state.data,
        sale: action.payload.data,
      };
      return {
        ...state,
        data: dt,
      };
    },
    saveNewSale(state, action) {
      const dt = {
        ...state.data,
        sale: action.payload,
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
        if (pathname === '/sale/sale/edit' && query && query.id > 0) {
          dispatch({ type: 'saveSaleId', payload: query.id });
        } else {
          dispatch({ type: 'saveSaleId', payload: -1 });
        }
      });
    },
  },
};
