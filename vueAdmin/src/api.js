import {
  Message,
} from 'element-ui';
import router from './router';
import {
  makeGet,
  makePost,
  setup,
  makePut,
  makeDelete,
  decorateMaker,
} from './plugins/axiosConfig';
import {
  isFunc,
} from './utils/helper';


const interceptor = function (res) {
  const {
    errcode,
    data,
    errmsg,
  } = res;
  if (errcode === 0) {
    return res;
  }
  Message.error({
    message: errmsg || '系统繁忙，请稍后再试',
  });
  return Promise.reject(res);
};
export const [get, post, put, del] = [makeGet, makePost, makePut, makeDelete].map(
  action => decorateMaker(action, interceptor),
);
const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://182.150.63.48:18086' : 'http://182.150.63.48:18086'; //测试
// const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'https://api.jyaqbz.cn:28087' : 'https://api.jyaqbz.cn:28087'; //正式
const baseUrl = API_BASE_URL.replace(/https?:/, location.protocol);
let obj = {
  baseURL: baseUrl,
  withCredentials: true,
  crossDomain: true,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'x-auth-token': ''
  },
  interceptors: {
    response(res) {
      if (res.code === 700) {
        router.push({ name: 'login' });
      } else {
        return res;
      }
    }
  },
};
setup(obj);


const apis = {
  //登录
  login: post('login'),
  logout: get('/loginout'),
  batchUpload: post('/common/batchUpload'),
  upload: post('/common/uploadFile'),
  imgPre: get('/common/image-prefix'),
  getValidateCode: get('/common/validate_code'),
  getDictionary: get('/common/dictionary'),
  cityData: get('/common/address'),
  getImgCode: get('/common/image_code_key'),
  getRejectReason: get('/common/rejection_reason'),
  getGrade: get('/common/grade'),
  getCourse: get('/common/courses'),

  ///专题列表
  subjectList: get('/axadmin/topic/list'),
  subjectStatus: get('/axadmin/topic/disabled'),
  subjectWeight: get('/axadmin/topic/set-weight'),
  subjectMediaWeight: get('/axadmin/topic/set-media-weight'),
  subjectSave: post('/axadmin/topic/save'),

  //内容审核
  userList: post('/axadmin/audit/user/datagrid'),
  userCheck: post('/axadmin/audit/user/examine'),

  //媒资信息审核
  mediaList: post('/axadmin/audit/media/datagrid'),
  mediaDetail: get('/axadmin/audit/media/detail'),
  mediaCheck: post('/axadmin/audit/media/examine'),
  mediaJoinHot: get('/axadmin/audit/media/join_hot'),
  mediaCancelHot: get('/axadmin/audit/media/cancel_hot'),
  subjectCheckList: post('/axadmin/audit/course/datagrid'),
  subjectCheck: get('axadmin/audit/course/examine'),
  subjectOff: get('/axadmin/audit/course/confirm_off_shelf'),


  //用户管理
  blackList: post('/axadmin/roster/datagrid'),
  blackJoin: get('/axadmin/roster/join_black_or_white'),

  //企业详情
  entrList: post('/axadmin/space/list'),
  entrById: get('/axadmin/topic/entr-name'),

  //文章管理
  articleList: get('/axadmin/article/datagrid'),
  articleTemplateList: get('/axadmin/article/template/list'),
  articleDelete: get('/axadmin/article/delete'),
  articleVisible: get('/axadmin/article/visible'),
  articleAdd: post('/axadmin/article/save'),
  articleInfo: get('/axadmin/article/detail'),

  //课程管理
  courseList: post('/axadmin/course/datagrid'),
  courseRecommond: get('/axadmin/course/join_or_cancel_rec'),
  courseSort: get('/axadmin/course/update_sort'),
  courseDel: get('/axadmin/course/delete'),



};


export const getApi = name => apis[name];

/**
 * 通过接口名称返回请求对象
 * @param {string} entry
 */
const api = function (entry, data, params) {
  // entry - string, array, function
  if (apis.hasOwnProperty(entry)) {
    return isFunc(apis[entry]) ? apis[entry](data, params) : apis[entry];
  }

  throw 'Entry not defined';
};
export default api;
