import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { login, imgPre } from '@/services/login';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: boolean;
  from?: number;
  message: string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: true,
    from: 6,
    message: '2',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const imgRes = yield call(imgPre);
      const response = yield call(login, payload);
      console.log(imgRes);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.success) {
        sessionStorage.setItem('token', response.data.xauthToken);
        sessionStorage.setItem('userInfo', JSON.stringify(response.data));
        history.replace({ pathname: 'welcome' });
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.success,
        message: payload.msg,
      };
    },
  },
};

export default Model;
