<template>
  <div class="ftp">
    <el-table :data="ftplistData" style="width: 90%;margin-top: 20px;" v-show="is_ftplist">
      <el-table-column label="FTP用户名" prop="ftp_user"></el-table-column>
      <el-table-column label="FTP密码" prop="ftp_passwd"></el-table-column>
      <el-table-column label="路径" prop="ftp_path"></el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope>
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row.nid)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.nid)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;text-align: center;" v-show="is_ftplist">
      <el-pagination background layout="prev, pager, next" :total="total" :current-page="page" :page-size="num"
        :page-count="pages" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <el-form ref="form" :model="form" label-width="100px" v-show="is_create" style="width: 90%;margin-top: 20px;">
      <el-form-item label="FTP名 ">
        <el-input v-model="form.ftp_user" placeholder="3-10个字母组成"></el-input>
      </el-form-item>
      <el-form-item label="FTP密码 ">
        <el-input v-model="form.ftp_passwd" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="FTP根目录">
        <el-input v-model="form.ftp_path" placeholder="默认是/home/wwwroot/FTP用户名">
          <template slot="prepend">/home/wwwroot/</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onAddFtp">创建站点</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="form2" :model="form2" label-width="100px" v-show="is_update" style="width: 90%;margin-top: 20px;">
      <el-form-item label="FTP名 ">
        <el-input v-model="form2.ftp_user" placeholder="3-10个字母组成" disabled></el-input>
      </el-form-item>
      <el-form-item label="FTP密码 ">
        <el-input v-model="form2.ftp_passwd" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="FTP根目录">
        <el-input v-model="form2.ftp_path" placeholder disabled></el-input>
      </el-form-item>
      <el-form-item label="开启/关闭">
        <el-switch v-model="form2.status"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onupFtp">更新站点</el-button>
        <el-button @click="goback('update')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Ftp",
  data () {
    return {
      ftplistData: [],
      pages: 1,
      num: 5,
      page: 1,
      total: 1,
      nid: "",
      search: "",
      is_ftplist: true,
      is_create: true,
      is_update: false,
      form: {
        ftp_user: "",
        ftp_path: ""
      },
      form2: {}
    };
  },
  methods: {
    handleCurrentChange (page) {
      this.page = page;
      this.ongetFtp();
    },
    ongetFtp () {
      let params = {
        nid: this.nid,
        page: this.page
      };
      this.$http
        .getftp(params)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            this.ftplistData = res.data;
            this.total = res.total;
            this.page = res.page;
            this.pages = res.pages;
            if (this.nid != "") {
              this.form2 = res.data[0];
              this.is_create = false;
              this.is_update = true;
              this.is_ftplist = false;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onAddFtp () {
      if (this.form.ftp_path != "") {
        var ftp_path = "/home/wwwroot/" + this.form.ftp_path;
      } else {
        var ftp_path = "";
      }
      let params = {
        ftp_user: this.form.ftp_user,
        ftp_passwd: this.form.ftp_passwd,
        ftp_path: ftp_path
      };
      this.$http
        .addftp(params)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            let data = res.data;
            this.$message({
              message: "创建站点成功",
              type: "success"
            });
            this.ongetFtp();
          }
        })
        .catch(error => {
          if (error.response) {
            this.$message.error(error.response.data.errmsg);
          } else {
            console.log(error.message);
          }
          console.log(error.config);
        });
    },
    handleEdit (nid) {
      this.nid = nid;
      this.ongetFtp();
    },
    handleDelete (nid) {
      let params = {
        nid: nid
      };
      this.$http
        .delftp(params)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            let data = res.data;
            this.ongetFtp();
          }
        })
        .catch(error => {
          if (error.response) {
            this.errmsg = error.response.data.errmsg;
          } else {
            console.log(error.message);
          }
          console.log(error.config);
        });
    },
    onupFtp () {
      let params = {
        nid: this.nid,
        ftp_user: this.form2.ftp_user,
        ftp_passwd: this.form2.ftp_passwd,
        ftp_path: this.form2.ftp_path,
        status: this.form2.status
      };
      this.$http
        .upftp(params)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            let data = res.data;
            this.$message({
              message: "更新站点成功",
              type: "success"
            });
            this.is_create = true;
            this.is_update = false;
            this.is_ftplist = true;
            this.nid = "";
            this.ongetFtp();
          }
        })
        .catch(error => {
          if (error.response) {
            this.errmsg = error.response.data.errmsg;
            this.$message.error(this.errmsg);
          } else {
            console.log(error.message);
          }
          console.log(error.config);
        });
    },
    goback (flag) {
      if (flag == "update") {
        this.nid = "";
      }
      this.is_update = false;
      this.is_create = true;
      this.is_ftplist = true;
      this.ongetFtp();
    }
  },
  created () {
    this.ongetFtp();
  }
};
</script>

<style scoped>
.ftp {
  padding: 30px;
  margin-bottom: 30px;
}
</style>