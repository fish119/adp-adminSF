import { getIndexData } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    // notices: [],
    currentUser: {},
    userMenus:[]
  },

  effects: {
    *fetchIndex(_, { call, put }) {
      const response = yield call(getIndexData);
      yield put({
        type: 'saveUserAndMenu',
        payload: {currentUser:response.user,userMenus:response.menus}
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveUserAndMenu(state,{ payload }){
      return {
        ...state,
        currentUser: payload.currentUser,
        userMenus:payload.userMenus
      };
    },
    // saveNotices(state, { payload }) {
    //   return {
    //     ...state,
    //     notices: payload,
    //   };
    // },
    // saveClearedNotices(state, { payload }) {
    //   return {
    //     ...state,
    //     notices: state.notices.filter(item => item.type !== payload),
    //   };
    // },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
