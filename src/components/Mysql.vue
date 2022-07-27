<template>
  <div class="ftp">
    <el-table :data="mysqllistData" style="width: 90%;margin-top: 20px;" v-show="is_mysqllist">
      <el-table-column label="Mysql用户名" prop="mysql_user"></el-table-column>
      <el-table-column label="Mysql数据库" prop="mysql_name"></el-table-column>
      <el-table-column label="Mysql密码" prop="mysql_passwd"></el-table-column>
      <el-table-column label="连接地址" prop="accept"></el-table-column>
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
    <div style="margin-top: 20px;text-align: center;" v-show="is_mysqllist">
      <el-pagination background layout="prev, pager, next" :total="total" :current-page="page" :page-size="num"
        :page-count="pages" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <el-form ref="form" :model="form" label-width="100px" v-show="is_create" style="width: 90%;margin-top: 20px;">
      <el-form-item label="Mysql用户名 ">
        <el-input v-model="form.mysql_user" placeholder="3-10个字母组成"></el-input>
      </el-form-item>
      <el-form-item label="Mysql数据库 ">
        <el-input v-model="form.mysql_name" placeholder="3-10个字母组成"></el-input>
      </el-form-item>
      <el-form-item label="Mysql密码 ">
        <el-input v-model="form.mysql_passwd" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="连接方式 ">
        <el-input v-model="form.accept" placeholder="%/localhost/ip地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onAddMysql">创建数据库</el-button>
        <el-button>返回</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="form2" :model="form2" label-width="100px" v-show="is_update" style="width: 90%;margin-top: 20px;">
      <el-form-item label="Mysql用户名 ">
        <el-input v-model="form2.mysql_user" placeholder="3-10个字母组成" disabled></el-input>
      </el-form-item>
      <el-form-item label="Mysql数据库 ">
        <el-input v-model="form2.mysql_name" placeholder="3-10个字母组成" disabled></el-input>
      </el-form-item>
      <el-form-item label="Mysql密码 ">
        <el-input v-model="form2.mysql_passwd" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="连接方式 ">
        <el-input v-model="form2.accept" placeholder="%/localhost/ip地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onupMysql">更新数据库</el-button>
        <el-button @click="goback('update')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Mysql",
  data () {
    return {
      mysqllistData: [],
      pages: 1,
      num: 5,
      page: 1,
      total: 1,
      nid: "",
      search: "",
      form: {
        mysql_user: ""
      },
      form2: {},
      is_mysqllist: true,
      is_create: true,
      is_update: false,
      nid: ""
    };
  },
  methods: {
    handleCurrentChange (page) {
      this.page = page;
      this.ongetMysql();
    },
    ongetMysql () {
      let params = {
        nid: this.nid,
        page: this.page
      };
      this.$http
        .getmysql(params)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            this.mysqllistData = res.data;
            this.total = res.total;
            this.page = res.page;
            this.pages = res.pages;
            if (this.nid != "") {
              this.form2 = res.data[0];
              this.is_create = false;
              this.is_update = true;
              this.is_mysqllist = false;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onAddMysql () {
      let params = {
        mysql_user: this.form.mysql_user,
        mysql_name: this.form.mysql_name,
        mysql_passwd: this.form.mysql_passwd,
        accept: this.form.accept
      };
      this.$http
        .addmysql(params)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            let data = res.data;
            this.$message({
              message: "创建数据库成功",
              type: "success"
            });
            this.ongetMysql();
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
    handleEdit (nid) {
      this.nid = nid;
      this.ongetMysql();
    },
    handleDelete (nid) {
      let params = {
        nid: nid
      };
      this.$http
        .delmysql(params)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            let data = res.data;
            this.ongetMysql();
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
    onupMysql () {
      let params = {
        nid: this.nid,
        mysql_passwd: this.form2.mysql_passwd,
        accept: this.form2.accept
      };
      this.$http
        .upmysql(params)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            let data = res.data;
            this.$message({
              message: "更新数据库成功",
              type: "success"
            });
            this.is_create = true;
            this.is_update = false;
            this.is_mysqllist = true;
            this.nid = "";
            this.ongetMysql();
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
      this.is_mysqllist = true;
      this.ongetMysql(this.nid);
    }
  },
  created () {
    this.ongetMysql(this.nid);
  }
};
</script>

<style scoped>
.ftp {
  padding: 30px;
  margin-bottom: 30px;
}
</style>