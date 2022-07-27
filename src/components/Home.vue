<template>
  <div class="home">
    <span class="el-icon-user-solid" @click="repasswd">{{ userInfo.username }}</span>
    <el-divider></el-divider>
    <span class="el-icon-setting">负 载 {{ loadavg.one }} {{ loadavg.five }} {{ loadavg.fifteen }}</span>
    <el-divider></el-divider>
    <span class="el-icon-setting">eth0发送流量 {{ netinfo.net_out.eth0 }} eth0接收流量 {{ netinfo.net_in.eth0 }}</span>
    <el-divider></el-divider>
    <span class="el-icon-setting">CPU {{ sysinfo.cputype }} 核心 {{ sysinfo.cpunum }}</span>
    <el-divider></el-divider>
    <span class="el-icon-setting">内存总大小 {{ sysinfo.memtotal }} 可用 {{ sysinfo.memfree }} 使用率 {{ sysinfo.mempercent
    }}</span>
    <el-divider></el-divider>
    <span class="el-icon-setting">根分区 总大小 {{ diskinfo.datotal }} 可用 {{ diskinfo.dafree }} 使用率 {{ diskinfo.dapercent
    }}</span>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="repasswdform">
        <el-form-item label="原密码" :label-width="formLabelWidth">
          <el-input v-model="repasswdform.oldpasswd" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="repasswdform.newpasswd" autocomplete="off" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">返 回</el-button>
        <el-button type="primary" @click="repasswd2">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Home",
  data () {
    return {
      timer: null,
      loadavg: {},
      sysinfo: {},
      diskinfo: {},
      netinfo: {
        net_in: { eth0: "loading" },
        net_out: { eth0: "loading" }
      },
      dialogFormVisible: false,
      repasswdform: {
        oldpasswd: "",
        newpasswd: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    getloadavg (info) {
      this.$http
        .gethome(info)
        .then(res => {
          if (res.errcode === 0) {
            if (info == "sysinfo") {
              this.sysinfo = res.data;
            } else if (info == "loadavg") {
              this.loadavg = res.data;
            } else if (info == "diskinfo") {
              this.diskinfo = res.data;
            } else if (info == "netinfo") {
              this.netinfo = res.data;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
      return;
    },
    repasswd () {
      this.dialogFormVisible = true;
      this.repasswdform = {
        oldpasswd: "",
        newpasswd: ""
      };
    },
    repasswd2 () {
      this.dialogFormVisible = false;
      this.$http
        .changepwd(this.repasswdform)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            this.$alert("密码修改成功,不过需要重新登录", "重新登录", {
              confirmButtonText: "确定",
              callback: action => {
                this.$store.dispatch("accountLogout").then(() => {
                  localStorage.clear();
                  location.reload();
                });
              }
            });
          }
        })
        .catch(error => {
          if (error.response) {
            // this.errmsg = error.response.data.errmsg;
            // this.$message.error(this.errmsg);
          } else {
            // console.log(error.message);
          }
          // console.log(error.config);
        });
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo;
    }
  },
  created () {
    this.getloadavg("sysinfo");
    this.getloadavg("loadavg");
    this.getloadavg("diskinfo");
    this.timer = setInterval(() => {
      this.getloadavg("loadavg");
      this.getloadavg("netinfo");
    }, 5000);
  },
  destroyed () {
    clearInterval(this.timer);
  },
  components: {}
};
</script>

<style>
.home {
  /* text-align: center; */
  padding: 30px;
  margin-bottom: 30px;
}
</style>
