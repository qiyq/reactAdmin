export default [
  {
    path: '/',
    component: '../layouts/LoginLayout',
  },
  {
    path: '/login',
    component: '../layouts/LoginLayout',
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    authority: ['admin'],
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/institution',
            name: '企业列表',
            icon: 'smile',
            component: './Institution',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/admin',
            name: 'admin',
            icon: 'crown',
            component: './Admin',
            routes: [
              {
                path: '/admin/sub-page',
                name: 'sub-page',
                icon: 'smile',
                component: './Welcome',
              },
            ],
          },
          {
            name: 'list.table-list',
            icon: 'table',
            path: '/list',
            component: './ListTableList',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
