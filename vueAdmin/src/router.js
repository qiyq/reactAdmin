import Vue from 'vue';
import Router from 'vue-router';

const Login = () => import(/* webpackChunkName: "index" */'./views/login.vue');
const notFound = () => import(/* webpackChunkName: "index" */ './views/404.vue');
const Home = () => import(/* webpackChunkName: "index" */ './views/home.vue');
const DashboardIndex = () => import(/* webpackChunkName: "index" */ './views/dashboard/index');
const SubjectList = () => import(/* webpackChunkName: "index" */ './views/subject/list');
const SubjectDetail = () => import(/* webpackChunkName: "index" */ './views/subject/detail');
const VideoCheck = () => import(/* webpackChunkName: "index" */ './views/check/video');
const ImageCheck = () => import(/* webpackChunkName: "index" */ './views/check/image');
const CourseCheck = () => import(/* webpackChunkName: "index" */ './views/check/course');
const UserCheck = () => import(/* webpackChunkName: "index" */ './views/check/user');
const InstitutionList = () => import(/* webpackChunkName: "index" */ './views/institution/list');
const UserList = () => import(/* webpackChunkName: "index" */ './views/user/list');
const OrderList = () => import(/* webpackChunkName: "index" */ './views/order/list');
const ArticleList = () => import(/* webpackChunkName: "index" */ './views/article/list');
const ArticleAdd = () => import(/* webpackChunkName: "index" */ './views/article/add');
const CourseList = () => import(/* webpackChunkName: "index" */ './views/course/list');


Vue.use(Router);

const scrollBehavior = (to, from, savedPosition) => {
  // SavedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition;
  }
  let position = {};
  // If no children detected
  if (to.matched.length < 2) {
    // Scroll to the top of the page
    position = {
      x: 0,
      y: 0,
    };
  } else if (to.matched.some(r => r.components.default.scrollToTop)) {
    // If one of the children has scrollToTop option set to true
    position = {
      x: 0,
      y: 0,
    };
  }
  // If link has anchor, scroll to anchor by returning the selector
  if (to.hash) {
    position = { selector: to.hash };
  }
  return position;
};

const router = new Router({
  mode: 'history',
  base: '/traffic/',
  scrollBehavior,
  routes: [
    {
      name: 'notFound',
      path: '*',
      component: notFound,
    },
    {
      path: '/',
      name: '/',
      component: Login,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [

        {
          path: 'dashboardIndex',
          name: 'dashboardIndex',
          component: DashboardIndex,
        },
        {
          path: 'subjectList',
          name: 'subjectList',
          component: SubjectList,
        },
        {
          path: 'courseList',
          name: 'courseList',
          component: CourseList,
        },
        {
          path: 'subjectDetail/:id',
          name: 'subjectDetail',
          component: SubjectDetail,
        },
        {
          path: 'imageCheck',
          name: 'imageCheck',
          component: ImageCheck,
        },
        {
          path: 'videoCheck',
          name: 'videoCheck',
          component: VideoCheck,
        },
        {
          path: 'userCheck',
          name: 'userCheck',
          component: UserCheck,
        },
        {
          path: 'courseCheck',
          name: 'courseCheck',
          component: CourseCheck,
        },
        {
          path: 'institutionList',
          name: 'institutionList',
          component: InstitutionList,
        },
        {
          path: 'userList',
          name: 'userList',
          component: UserList,
        },
        {
          path: 'orderList',
          name: 'orderList',
          component: OrderList,
        },
        {
          path: 'articleList',
          name: 'articleList',
          component: ArticleList,
        },
        {
          path: 'articleAdd',
          name: 'articleAdd',
          component: ArticleAdd,
        },
        {
          path: 'articleEdit/:id',
          name: 'articleEdit',
          component: ArticleAdd,
        },
      ]
    }

  ],
});

router.beforeEach((to, from, next) => {
  // const token = sessionStorage.getItem('token');
  // if (to.name !== 'login' && !token && to.name !== 'initPwd') {
  //   next({ path: '/login' }); // 否则全部重定向到登录页
  // } else {
  //   next();
  // }
  next();

});

export default router;
