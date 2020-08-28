import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import { message } from 'antd';
import { login, loginout } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

export interface StateType {
  status?: boolean;
  from?: number;
  message: string;
  currentAuthority?: 'admin';
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
    message: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.success) {
        sessionStorage.setItem('token', response.data.xauthToken);
        sessionStorage.setItem('userInfo', JSON.stringify(response.data));
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        message.success('登录成功！');
        history.replace(redirect || '/welcome');
      }
    },

    *logout({}, { call, put }) {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/login' && !redirect) {
        const response = yield call(loginout);
        if (response.success) {
          message.success('退出成功！');
          history.replace({
            pathname: '/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
          sessionStorage.clear();
        }
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('admin');
      return {
        ...state,
        status: payload.success,
        message: payload.msg,
      };
    },
  },
};

export default Model;
