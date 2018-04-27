import {
  getAllArticleCategories,
  saveArticleCategory,
  deleteArticleCategory,
  queryArticles,
} from '../services/api';

export default {
  namespace: 'article',
  state: {
    data: {
      categories: [],
      articles: {
        list: [],
        pagination: {},
      },
    },
  },
  effects: {
    *fetchCategories(_, { call, put }) {
      const response = yield call(getAllArticleCategories);
      yield put({ type: 'saveCategories', payload: response });
    },
    *saveCategory({ payload, callback }, { call, put }) {
      const response = yield call(saveArticleCategory, payload);
      if (response) {
        yield put({ type: 'saveCategories', payload: response });
      }
      if (callback && response) {
        yield callback();
      }
    },
    *deleteCategory({ payload, callback }, { call, put }) {
      const response = yield call(deleteArticleCategory, payload);
      if (response) {
        yield put({ type: 'saveCategories', payload: response });
      }
      if (callback && response) {
        yield callback();
      }
    },
    *fetchArticles({ payload }, { call, put }) {
      const response = yield call(queryArticles, payload);
      yield put({
        type: 'saveArticles',
        payload: response,
      });
    },
  },
  reducers: {
    saveCategories(state, action) {
      const dt = {
        ...state.data,
        categories: action.payload.data,
      };
      return {
        ...state,
        data: dt,
      };
    },
    saveArticles(state, action) {
      const dt = {
        ...state.data,
        articles: {
          list: action.payload.data.content,
          pagination: {
            total: action.payload.data.totalElements,
            pageSize: action.payload.data.pageable.pageSize,
            current: action.payload.data.pageable.pageNumber + 1,
          },
        },
      };
      return {
        ...state,
        data: dt,
      };
    },
  },
};
