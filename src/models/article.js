import {
  getAllArticleCategories,
  saveArticleCategory,
  deleteArticleCategory,
  queryArticles,
  geArticle,
  saveArticle,
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
      article: {},
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
    *saveArticleId({ payload }, { put }) {
      yield put({
        type: 'setArticleid',
        payload,
      });
    },
    *getArticle({ payload,callback }, { call, put }) {
      const response = yield call(geArticle, payload);
      if (callback && response) {
        yield callback(response);
      }
      yield put({
        type: 'saveArticle',
        payload: response,
      });
    },
    *setNewArticle({ payload }, { put }) {
      yield put({
        type: 'saveNewArticle',
        payload,
      });
    },
    *postArticle({ payload, callback }, { call, put }) {
      const response = yield call(saveArticle, payload);
      if (response) {
        yield put({ type: 'saveArticle', payload: response });
      }
      if (callback && response) {
        yield callback();
      }
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
    setArticleid(state, action) {
      return {
        ...state,
        articleid: action.payload,
      };
    },
    saveArticle(state, action) {
      const dt = {
        ...state.data,
        article: action.payload.data,
      };
      return {
        ...state,
        data: dt,
      };
    },
    saveNewArticle(state, action) {
      const dt = {
        ...state.data,
        article: action.payload,
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
        if (pathname === '/article/article/edit' && query && query.id > 0) {
          dispatch({ type: 'saveArticleId', payload: query.id });
        } else {
          dispatch({ type: 'saveArticleId', payload: -1 });
        }
      });
    },
  },
};
