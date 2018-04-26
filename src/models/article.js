import {
  getAllArticleCategories,
  saveArticleCategory,
  deleteArticleCategory,
} from '../services/api';

export default {
  namespace: 'article',
  state: {
    data: {
      categories: [],
      articles: [],
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
  },
  reducers: {
    saveCategories(state, action) {
      return {
        ...state,
        data: { categories: action.payload.data },
      };
    },
    saveArticles(state, action) {
      return {
        ...state,
        data: { articles: action.payload.data },
      };
    },
  },
};
