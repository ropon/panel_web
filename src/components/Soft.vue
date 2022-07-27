<template>
  <div>
    <el-table :data="sotlistData" style="width: 90%;margin-top: 20px;">
      <el-table-column label="软件名称" prop="soft_name"></el-table-column>
      <el-table-column label="软件版本" prop="soft_ver"></el-table-column>
      <el-table-column label="软件描述" prop="soft_desc"></el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入软件名称搜索" @keyup.native="onSearch" />
        </template>
        <template slot-scope="scope">
          <el-button v-if="!scope.row.is_install" size="mini" icon="el-icon-circle-plus"
            @click="handleInstall(scope.row.nid, scope.row.soft_name, scope.row.soft_ver)">安装</el-button>
          <el-button v-else-if="scope.row.is_install == 2" size="mini" icon="el-icon-loading">安装中</el-button>
          <el-button v-else type="danger" size="mini" icon="el-icon-remove" @click="handleUninstall(scope.row.nid)">卸载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;text-align: center;">
      <el-pagination background layout="prev, pager, next" :total="total" :current-page="page" :page-size="num"
        :page-count="pages" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <el-dialog title="安装方式" :visible.sync="dialogFormVisible">
      <el-form :model="installform">
        <el-form-item label="软件名称" :label-width="formLabelWidth">
          <el-input v-model="installform.soft_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="软件版本" :label-width="formLabelWidth">
          <el-input v-model="installform.soft_ver" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="安装方式" :label-width="formLabelWidth">
          <el-radio v-model="installform.installtype" label="rpm">极速</el-radio>
          <el-radio v-model="installform.installtype" label="bash">编译</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="InstallSoft">安 装</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Soft",
  data () {
    return {
      pages: 1,
      num: 5,
      page: 1,
      total: 1,
      nid: "",
      sotlistData: [],
      search: "",
      dialogFormVisible: false,
      installform: {
        nid: "",
        soft_name: "",
        installtype: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    send () {
      console.log(1111111111);
      this.$socket.emit("message", "1111111111");
    },
    handleCurrentChange (page) {
      this.page = page;
      this.onGetsoft();
    },
    onGetsoft () {
      let params = {
        nid: this.nid,
        page: this.page
      };
      this.$http
        .getsoft(params)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            this.sotlistData = res.data;
            this.total = res.total;
            this.page = res.page;
            this.pages = res.pages;
          }
        })
        .catch(error => { });
    },
    handleInstall (nid, soft_name, soft_ver) {
      this.dialogFormVisible = true;
      this.installform.nid = nid;
      this.installform.soft_name = soft_name;
      this.installform.soft_ver = soft_ver;
      this.installform.installtype = "rpm";
    },
    handleUninstall () {
      console.log("卸载成功");
    },
    InstallSoft () {
      this.dialogFormVisible = false;
      this.$http
        .upsoft(this.installform)
        .then(res => {
          if (res.errcode === 0) {
            let data = res.data;
            this.$message({
              message: res.errmsg,
              type: "success"
            });
            this.onGetsoft();
          }
        })
        .catch(error => { });
    },
    onSearch () {
      if (this.search != "") {
        let params = {
          soft_name: this.search
        };
        this.$http
          .getsoft(params)
          .then(res => {
            this.errmsg = res.errmsg;
            if (res.errcode === 0) {
              this.sotlistData = res.data;
              this.total = res.total;
              this.page = res.page;
              this.pages = res.pages;
            }
          })
          .catch(error => { });
      }
    }
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    message: function (val) {
      console.log("返回:" + val);
    }
  },
  created () {
    this.onGetsoft();
  }
};
</script>

<style>
</style>