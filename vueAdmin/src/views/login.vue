<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :inline="true" class="login_m " label-width="80px">
      <div class="login_logo">
        <!--        <img src="../assets/imgs/login_logo.png" width="368" height="74">-->
        流量监控后台系统
      </div>
      <div class="login_boder">
        <div class="loginType">
          登录
        </div>
        <div class="width328">
          <el-form-item
            prop="username"
            class="margin-top24"
            :rules="[
      { required: true, message: '请输入用户名称', trigger: 'blur' }
       ]"
          >
            <el-input type="text" id="username" class="txt_input txt_input2"
                      v-model="loginForm.username"
                      prefix-icon="el-icon-user"
                      placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            class="margin-top2"
            :rules="[
      { required: true, message: '请输入登录密码', trigger: 'blur' }
    ]"
          >
            <el-input type="password" id="userpwd" class="txt_input" v-model="loginForm.password"
                      prefix-icon="el-icon-lock"
                      placeholder="请输入登录密码"></el-input>
          </el-form-item>
        </div>
        <div class="login-btn">
          <el-button type="success" @click="login">登 录</el-button>
        </div>

      </div>

    </el-form>
  </div>

</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        imgPath: '',
        loginForm: {
          username: '',
          password: '',
          from: 6
        },
      };
    },
    created() {
      // this.getImgCodeKey();
    },
    mounted() {
      this.$refs.loginForm.resetFields();
    },
    methods: {
      refreshImg() {
        this.getImgCodeKey();
      },
      getImgCodeKey() {
        this.$model('getImgCode')
          .then((res) => {
            if (res.success) {
              this.loginForm.key = res.data;
              this.imgPath = `${this.$baseURL}/common/image_code?type=1&key=${res.data}`;
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      getImgPre() {
        this.$model('imgPre')
          .then((res) => {
            if (res.success) {
              sessionStorage.setItem('imgPre', res.data);
            } else {
              this.$message.error(res.msg);
            }
          });
      },
      async login() {
        sessionStorage.clear();
        const valid = await this.formValidate('loginForm');
        if (!valid) return;
        this.$model('login', this.loginForm)
          .then((res) => {
            if (res.success) {
              sessionStorage.setItem('loginInfo', JSON.stringify(res.data));
              sessionStorage.setItem('token', res.data.xauthToken);
              this.$message.success('登录成功！');
              this.getImgPre();
              this.$router.push({
                name: 'dashboardIndex',
              });
            } else {
              this.$message.error(res.msg);
            }
          });

      },
    },
  };
</script>
<style lang="less">
  .imgCheck {
    .el-form-item__content {
      display: flex !important;
    }
  }
</style>
<style scoped lang="less">
  .login {
    background: url("../assets/imgs/bg.jpg") no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .el-form-item {
      margin-right: 0;
    }

    .login_m {
      width: 510px;
      margin: 100px auto 0;
      display: flex;
      flex-direction: column;
      align-items: center;


      .login_logo {
        text-align: center;
        font-size: 36px;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        line-height: 42px;
      }

      .login_boder {
        height: 364px;
        width: 440px;
        margin-top: 80px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 2px 4px 2px rgba(12, 179, 152, 0.3);
        border-radius: 4px;
        margin-left: 5px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;

        .loginType {
          margin-top: 36px;
          color: #595959;
          width: 264px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          color: rgba(38, 38, 38, 1);
          line-height: 24px;

          span {
            display: inline-block;
            cursor: pointer;

            &.active {
              color: #0CB398;
            }
          }
        }

        .el-input {
          width: 328px;
          height: 40px;
          border-radius: 4px;
          line-height: 40px;
          font-size: 14px;
          color: #717171;
        }

        .el-input.img_input {
          width: 200px;
        }

        .imgPath {
          width: 110px;
          height: 40px;
          margin-left: 18px;
          cursor: pointer;
        }

        .login-btn {
          text-align: center;
          margin-top: 12px;

          button {
            width: 328px;
            height: 40px;
            background: rgba(12, 179, 152, 1);
            border-radius: 4px;

            &:hover {
              background: rgba(12, 179, 152, .6);
            }
          }
        }
      }
    }
  }
</style>
