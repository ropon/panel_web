<template>
  <div class="login">
    <div style="width: 60%;margin-top: 20px;text-align: center;">
      <el-input v-model="username" placeholder="请输入用户名"></el-input>
      <!-- 回车登录 @keyup.enter.native="onLogin" -->
      <el-input v-model="password" placeholder="请输入密码" show-password style="margin-top: 20px;"
        @keyup.enter.native="onLogin"></el-input>
      <el-button type="primary" @click="onLogin" style="margin-top: 20px;">登 录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    onLogin () {
      let params = {
        username: this.username,
        password: this.password
      };
      this.$http
        .login(params)
        .then(res => {
          if (res.errcode === 0) {
            let username = res.data.username;
            let token = res.data.token;
            let www_path = res.data.www_path;

            localStorage.setItem("username", username);
            localStorage.setItem("token", token);

            let user = {
              token: localStorage.getItem("token"),
              username: localStorage.getItem("username"),
            };
            this.$store.dispatch("getUserInfo", user);
            this.$message({
              message: "登录成功",
              type: "success"
            });
            this.$router.go(-1);
          } else {
            this.$message.error(res.errmsg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {}
};
</script>

<style>
.login {
  /* text-align: center; */
  padding: 30px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}
</style>
