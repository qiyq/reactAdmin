import { stringify } from 'querystring';
import { Reducer, Effect } from 'umi';
import { message } from 'antd';
import { entrById, entrList, EntrListParamsType } from '@/services/insititution';

export interface InstitutionStateType {
  params: EntrListParamsType;
  list: [];
}

export interface InstitutionModelType {
  namespace: string;
  state: InstitutionStateType;
  effects: {
    getList: Effect;
    getInfoById: Effect;
  };
  reducers: {
    tableListData: Reducer<InstitutionStateType>;
  };
}

const Model: InstitutionModelType = {
  namespace: 'institution',

  state: {
    params: {
      areaCode: '',
      endTime: '',
      entrId: '',
      entrName: '',
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      startTime: '',
      state: null,
    },
    list: [],
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(entrList, payload);
      if (response.success) {
        yield put({
          type: 'tableListData',
          payload: {
            list: response.data.records,
            pageNo: response.data.current,
            totalCount: response.data.total,
          },
        });
      } else {
        message.success(response.msg);
      }
    },
    *getInfoById({ payload }, { call, put }) {
      // Login successfully
      // if (response.success) {
      //   sessionStorage.setItem('token', response.data.xauthToken);
      //   sessionStorage.setItem('userInfo', JSON.stringify(response.data));
      //   console.log(history);
      //   history.push({ pathname: 'welcome' });
      // }
    },
  },

  reducers: {
    tableListData(state, { payload }) {
      return {
        ...state,
        list: payload.list,
        params: {
          ...state!.params,
          pageNo: payload.pageNo,
          totalCount: payload.totalCount,
        },
      };
    },
  },
};

export default Model;
