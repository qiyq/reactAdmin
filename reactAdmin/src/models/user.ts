import { Effect, Reducer } from 'umi';

// import { queryCurrent, query as queryUsers } from '@/services/user';
export interface CurrentUser {
  id?: number;
  username?: string;
  password?: any;
  initPassword?: boolean;
  name?: string;
  gender?: any;
  permission?: any;
  salt?: any;
  locked?: boolean;
  credentialsExpired?: boolean;
  createTime?: number;
  updateTime?: any;
  lastLoginTime?: number;
  email?: any;
  phone?: any;
  duty?: any;
  remarks?: any;
  province?: any;
  city?: any;
  county?: any;
  provinceName?: any;
  cityName?: any;
  countyName?: any;
  address?: any;
  disabled?: any;
  isSuper?: boolean;
  mac?: any;
  bindPhone?: any;
  bankId?: any;
  openId?: any;
  userInfo?: any;
  adminArea?: any;
  adminMenu?: any;
  enprStatus?: boolean;
  deviceToken?: any;
  deviceType?: string;
  aliUserId?: any;
  aliUserInfo?: any;
  avatar?: any;
  personalSignature?: any;
  infoStatus?: number;
  roles?: any[];
  instSubs?: any[];
  authStatus?: any;
  entrId?: any;
  instSubNames?: any;
  roleCode?: string;
  areas?: any[];
  reason?: any;
  commitTime?: any;
  entrName?: any;
  fullAddress?: any;
  guardianState?: boolean;
  haveRiskAccount?: boolean;
  purchased?: boolean;
  studentAreaCodes?: any;
  hideAdmin?: boolean;
  accessToken?: any;
  bankInfo?: any;
  businessType?: any;
  followed?: any;
  mediaResCount?: any;
  followCount?: any;
  fansCount?: any;
  likeCount?: any;
  inBlackList?: any;
  xauthToken?: string;
}
export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}
export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      // const response = yield call(queryUsers);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      // yield put({
      //   type: 'saveCurrentUser',
      //   payload: response,
      // });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
