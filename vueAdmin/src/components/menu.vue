<template>
  <el-aside class="menu menu-page" width="256px">
    <el-row class="menu-item">
      <div class="menu-user">
        <div class="menu-user-img"><img src="../assets/imgs/head.png" alt=""></div>
        <div class="menu-text">
          数据服务系统
        </div>

      </div>
      <el-divider class="divi"></el-divider>
      <el-col :span="24" class="itemList">
        <el-menu
          :unique-open="true"
          :default-active="currentPath"
          class="el-menu-vertical-demo"
          @select="selectMenu"
          text-color="#262626"
        >
          <template v-for="item in menuList">
            <template v-if="item.children.length > 0">
              <el-submenu :key="item.id" :index="item.path" class="subMenu">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{item.name}}</span>
                </template>
                <el-menu-item v-for="child in item.children" :key="child.id" :index="child.path">
                  {{child.name}}
                </el-menu-item>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :key="item.id" :index="item.path" class="noSubMenu">
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
            </template>

          </template>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>

  export default {
    name: 'menuItem',
    data() {
      return {
        uniqueOpened: true,
        menuList: [],
      };
    },
    computed: {
      currentPath() {
        let path = /home/.test(this.$route.path)
          ? this.$route.path.replace(/\/home\//, '')
          : 'dashboardIndex';
        return path;
      },
    },
    created() {
      // let menuList = JSON.parse(sessionStorage.getItem('menuList'));
      let menuList = [
        {
          icon: 'iconfont iconclass',
          id: 1,
          name: '汇总数据',
          path: 'dashboardIndex',
          children: []
        },
        {
          icon: 'iconfont iconclass',
          id: 2,
          name: '企业列表',
          path: 'institutionList',
          children: []
        },
        {
          icon: 'iconfont iconclass',
          id: 3,
          name: '购买记录',
          path: 'orderList',
          children: []
        },
        {
          icon: 'iconfont iconclass',
          id: 4,
          name: '专题列表',
          path: 'subjectList',
          children: []
        },
        {
          icon: 'iconfont iconclass',
          id: 5,
          name: '内容审核',
          path: 'check',
          children: [
            {
              icon: 'iconfont iconclass',
              id: 1,
              name: '视频审核',
              path: 'videoCheck',
            },
            {
              icon: 'iconfont iconclass',
              id: 2,
              name: '图文审核',
              path: 'imageCheck',
            },
            {
              icon: 'iconfont iconclass',
              id: 3,
              name: '用户审核',
              path: 'userCheck',
            },
            {
              icon: 'iconfont iconclass',
              id: 53,
              name: '课程审核',
              path: 'courseCheck',
            }
          ]
        },
        {
          icon: 'iconfont iconclass',
          id: 6,
          name: '用户管理',
          path: 'userList',
          children: []
        },
        {
          icon: 'iconfont iconclass',
          id: 66,
          name: '课程管理',
          path: 'courseList',
          children: []
        },
        // {
        //   icon: 'iconfont iconclass',
        //   id: 7,
        //   name: '企业课程',
        //   path: 'dashboardIndex6',
        //   children: []
        // },
        // {
        //   icon: 'iconfont iconclass',
        //   id: 8,
        //   name: 'App推送',
        //   path: 'dashboardIndex4',
        //   children: []
        // },
        // {
        //   icon: 'iconfont iconclass',
        //   id: 9,
        //   name: '关键词管理',
        //   path: 'dashboardIndex5',
        //   children: []
        // },
        {
          icon: 'iconfont iconclass',
          id: 10,
          name: '资讯管理',
          path: 'articleList',
          children: []
        }
      ];
      if ((Array.isArray(menuList) && menuList.length === 0) || !menuList) {
        this.getList();
      } else {
        this.menuList = menuList;
      }
    },
    methods: {
      selectMenu(index) {
        if (index !== this.$route.name) {
          this.$router.push({ name: index });
        }
      },
      getList() {
        this.$model('menuUserList')
          .then((res) => {
            if (res.success) {
              this.menuList = res.data.map(item => {
                return {
                  id: item.id,
                  name: item.name,
                  path: item.path,
                  icon: item.icon,
                  children: []//暂时没有子菜单
                  // children: item.children.map(subItem => {
                  //   return {
                  //     id: subItem.url,
                  //     name: subItem.menuName,
                  //     path: subItem.url,
                  //   };
                  // })
                };
              });
              sessionStorage.setItem('menuList', JSON.stringify(this.menuList));
            } else {
              this.$message.error(res.msg);
            }
          });
      },

    },
  };
</script>

<style lang="less">

  .el-menu {
    border-right: unset !important;
  }

  .menu-page {
    position: relative;
    background-color: white;
    font-size: 14px;
    text-align: left;
    overflow-x: hidden;
    overflow-y: hidden;
    height: 100%;


    .menu-item {
      margin-top: 30px;
      cursor: pointer;

      .el-menu-item {
        i.fa {
          color: white;
        }

        &.is-active {
          i.fa {
            color: #0CB398;
          }
        }
      }

      .is-opened {
        .el-submenu__title {
          background-color: rgb(36, 51, 67) !important;
        }
      }

      .subMenu {
        .el-menu--inline {
          li.el-menu-item {
            padding-left: 80px !important;
          }

          .el-menu-item.is-active {
            color: #0CB398;
          }

          .el-menu-item:hover {
            background-color: rgba(12, 179, 152, .7);
            color: white !important;
          }
        }
      }

      .el-submenu__title {
        height: 45px;
        line-height: 45px;
        padding-left: 35px !important;

        .el-submenu__icon-arrow {
          left: 230px;
          font-size: 20px;
          right: unset !important;
        }

        i.fa {
          color: white;
        }
      }

      .divi {
        margin-left: 24px;
        width: 208px;
      }

      .menu-user {
        display: flex;
        width: 208px;
        margin-left: 24px;


        .menu-text {
          height: 56px;
          margin-left: 12px;
          display: flex;
          flex-direction: column;
          width: 122px;
          justify-content: center;

        }

        &-img {
          width: 56px;
          height: 56px;
          border-radius: 50%;

          img {
            width: 56px;
            height: 56px;
            border-radius: 50%;
          }
        }
      }

      .itemList {
        .el-menu {
          .iconfont {
            margin-right: 10px;
            font-size: 20px;
          }

          .el-icon-arrow-down {
            font-size: 20px;
          }

          .el-menu-item, .el-submenu__title {
            padding-left: 35px !important;
            background-color: white !important;
            height: 52px !important;
            line-height: 52px !important;

            &:hover {
              color: #0CB398 !important;

              i {
                color: #0CB398 !important;
              }
            }
          }

          .is-opened .el-submenu__title {
            color: #0CB398 !important;
          }

          .el-menu-item.is-active {
            color: #FFFFFF !important;
            background-color: #0CB398 !important;

            i {
              color: white !important;
            }
          }

        }
      }
    }
  }


</style>

