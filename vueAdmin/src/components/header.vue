<template>
  <el-header class="header">
    <div class="header-content">
      <div class="logo">
<!--        四川教培最低余额专用账户管理-->
      </div>
      <div class="profile">

        <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
         <img class="avater" src="../assets/imgs/head.png" alt="">
        <span class="name">{{loginInfo.username}}</span>
        <span class="tip">{{this.$store.getters.name}}</span>
        <!--                <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting" command="1">修改密码</el-dropdown-item>
            <el-dropdown-item icon="el-icon-user" command="2">基本信息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span @click="gotoNotice" >
              <span class="message"><el-badge :value="this.$store.state.noticeNo" class="item">
<i class="el-icon-bell"></i>
</el-badge></span>
        </span>
        <el-divider direction="vertical" class="divider"></el-divider>
        <span class="logout" @click="signOut">账户设置</span>
        <el-divider direction="vertical" class="divider"></el-divider>
        <span class="logout" @click="signOut">退出</span>
      </div>
    </div>
  </el-header>
</template>

<script>
  export default {
    name: 'headerCom',

    data() {
      return {
        loginInfo: {
          name: '',
          username: '',
        }
      };
    },
    created() {
      // this.loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    },
    methods: {
      gotoNotice(){

     },
      handleCommand(command) {
        if (command === '1') {
          if (this.$route.name !== 'changePwd') {
            this.$router.push({ name: 'changePwd' });
          }
        } else {
          if (this.$route.name !== 'changeMana') {
            this.$router.push({ name: 'changeMana' });
          }
        }

      },
      signOut() {
        this.$model('logout')
          .then((res) => {
            if (res.success) {
              this.$message.success('退出成功！');
              this.$router.push({ name: 'login' });
              sessionStorage.clear();
            } else {
              this.$message.error(res.msg);
            }
          });
      },
    },
  };
</script>
<style scoped lang="less">
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #0CB398;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);

    .el-dropdown {
      color: white;

      .el-dropdown-link {
        height: 32px;
        display: flex;
        line-height: 32px;
      }
    }

    .logo {
      height: 40px;
      line-height: 40px;
      margin-left: 24px;
      margin-top: 10px;
      cursor: pointer;
      font-size: 24px;
      font-weight: normal;
      color: rgba(255, 255, 255, 1);
    }

    .avater {
      height: 32px;
      width: 32px;
      border-radius: 50%;
    }

    &-content {
      width: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;


      .profile {
        height: 60px;
        line-height: 60px;
        color: white;
        display: flex;
        align-items: center;
        cursor: pointer;

        .divider {
          height: 24px;
          vertical-align: sub;
          margin-right: 10px;
        }

        .tip {
          font-size: 14px;
          margin-right: 10px;
          display: inline-block;
        }

        .name {
          font-size: 14px;
          margin-right: 10px;
          vertical-align: top;
          display: inline-block;
          margin-left: 10px;
        }

        .logout {
          font-size: 14px;
        }
      }
    }


  }

</style>
