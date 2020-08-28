import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { entrById, entrList, EntrListParamsType } from '@/services/insititution';
import { getPageQuery } from '@/utils/utils';

export interface InstitutionType {
  params: EntrListParamsType;
}

export interface InstitutionModelType {
  namespace: string;
  state: InstitutionType;
  effects: {
    getList: Effect;
    getInfoById: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<InstitutionType>;
  };
}

const Model: InstitutionModelType = {
  namespace: 'instition',

  state: {
    params: {
      areaCode: '',
      endTime: '',
      entrId: '',
      entrName: '',
      pageNo: 1,
      pageSize: 10,
      startTime: '',
      state: null,
    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(entrList, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.success) {
        sessionStorage.setItem('token', response.data.xauthToken);
        sessionStorage.setItem('userInfo', JSON.stringify(response.data));
        console.log(history);
        history.push({ pathname: 'welcome' });
      }
    },
    *getInfoById({ payload }, { call, put }) {
      const response = yield call(entrById, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.success) {
        sessionStorage.setItem('token', response.data.xauthToken);
        sessionStorage.setItem('userInfo', JSON.stringify(response.data));
        console.log(history);
        history.push({ pathname: 'welcome' });
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
