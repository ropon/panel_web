<template>
  <div class="site">
    <el-table :data="sitelistData" style="width: 90%;margin-top: 20px;" v-show="is_sitelist">
      <el-table-column label="站点名" prop="site_name"></el-table-column>
      <el-table-column label="网站根目录" prop="root_path"></el-table-column>
      <el-table-column label="绑定域名" prop="bind_domain"></el-table-column>
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
    <div style="margin-top: 20px;text-align: center;" v-show="is_sitelist">
      <el-pagination background layout="prev, pager, next" :total="total" :current-page="page" :page-size="num"
        :page-count="pages" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <el-form ref="form" :model="form" label-width="100px" v-show="is_create" style="width: 90%;margin-top: 20px;">
      <el-form-item label="站点名">
        <el-input v-model="form.site_name" placeholder="3-10个字母组成" @keyup.native="onGetinfo"></el-input>
      </el-form-item>
      <el-form-item label="绑定域名">
        <el-input v-model="form.bind_domain" placeholder="多个域名以英文逗号,分隔,中文域名请绑定转码"></el-input>
      </el-form-item>
      <el-form-item label="网站根目录">
        <el-input v-model="form.root_path" placeholder="默认/home/wwwroot/站点名"></el-input>
      </el-form-item>
      <el-form-item label="PHP版本">
        <el-select v-model="form.site_info.php_ver" placeholder="请选择PHP版本">
          <el-option label="php5.6" value="php5.6"></el-option>
          <el-option label="php7.0" value="php7.0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建FTP">
        <el-switch v-model="form.ftpinfo.is_create"></el-switch>
      </el-form-item>
      <el-form-item label="FTP用户名" v-show="form.ftpinfo.is_create">
        <el-input v-model="form.ftpinfo.ftp_user" placeholder="3-10个字母组成"></el-input>
      </el-form-item>
      <el-form-item label="FTP密码" v-show="form.ftpinfo.is_create">
        <el-input v-model="form.ftpinfo.ftp_passwd" placeholder="请输入密码,不填是随机密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="创建MYSQL">
        <el-switch v-model="form.mysqlinfo.is_create"></el-switch>
      </el-form-item>
      <el-form-item label="Mysql用户名" v-show="form.mysqlinfo.is_create">
        <el-input v-model="form.mysqlinfo.mysql_user" placeholder="3-10个字母组成"></el-input>
      </el-form-item>
      <el-form-item label="Mysql数据库" v-show="form.mysqlinfo.is_create">
        <el-input v-model="form.mysqlinfo.mysql_name" placeholder="3-10个字母组成"></el-input>
      </el-form-item>
      <el-form-item label="Mysql密码" v-show="form.mysqlinfo.is_create">
        <el-input v-model="form.mysqlinfo.mysql_passwd" placeholder="请输入密码,不填是随机密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="连接方式" v-show="form.mysqlinfo.is_create">
        <el-input v-model="form.mysqlinfo.accept" placeholder="%/localhost/ip地址"></el-input>
      </el-form-item>
      <el-form-item label="开启SSL">
        <el-switch v-model="form.site_info.is_ssl"></el-switch>
      </el-form-item>
      <el-form-item label="crt的内容" v-show="form.site_info.is_ssl">
        <el-input type="textarea" v-model="form.site_info.sslcrt"
          placeholder="-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"></el-input>
      </el-form-item>
      <el-form-item label="key的内容" v-show="form.site_info.is_ssl">
        <el-input type="textarea" v-model="form.site_info.sslkey"
          placeholder="-----BEGIN RSA PRIVATE KEY----- ... -----END RSA PRIVATE KEY-----"></el-input>
      </el-form-item>
      <el-form-item label="开启301">
        <el-switch v-model="form.site_info.extra_kwargs.set_301"></el-switch>
      </el-form-item>
      <el-form-item label="跳转的域名" v-show="form.site_info.extra_kwargs.set_301">
        <el-input v-model="form.site_info.domain_301" placeholder="请输入301目标地址,比如www.ropon.top,中文域名请绑定转码"></el-input>
      </el-form-item>
      <el-form-item label="开启日志">
        <el-switch v-model="form.site_info.is_log"></el-switch>
      </el-form-item>
      <el-form-item label="额外设置">
        开启404错误页
        <el-switch v-model="form.site_info.extra_kwargs.set_404"></el-switch>屏蔽非常见UA
        <el-switch v-model="form.site_info.extra_kwargs.deny_ua"></el-switch>启用防盗链
        <el-switch v-model="form.site_info.extra_kwargs.deny_referer"></el-switch>安全加固
        <el-switch v-model="form.site_info.extra_kwargs.safe"></el-switch>开启缓存
        <el-switch v-model="form.site_info.extra_kwargs.cache"></el-switch>
      </el-form-item>
      <el-form-item label="网站备注">
        <el-input type="textarea" v-model="form.note"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onAddsite">创建站点</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

    <el-form ref="form2" :model="form2" label-width="100px" v-show="is_update" style="width: 90%;margin-top: 20px;">
      <el-form-item label="站点名">
        <el-input v-model="form2.site_name" disabled></el-input>
      </el-form-item>
      <el-form-item label="绑定域名">
        <el-input v-model="form2.bind_domain"></el-input>
      </el-form-item>
      <el-form-item label="网站根目录">
        <el-input v-model="form2.root_path" disabled></el-input>
      </el-form-item>
      <el-form-item label="PHP版本">
        <el-select v-model="form2.site_info.php_ver">
          <el-option label="php5.6" value="php5.6"></el-option>
          <el-option label="php7.0" value="php7.0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开启SSL">
        <el-switch v-model="form2.site_info.is_ssl"></el-switch>
      </el-form-item>
      <el-form-item label="crt的内容" v-show="form2.site_info.is_ssl">
        <el-input type="textarea" v-model="form2.site_info.sslcrt"
          placeholder="-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"></el-input>
      </el-form-item>
      <el-form-item label="key的内容" v-show="form2.site_info.is_ssl">
        <el-input type="textarea" v-model="form2.site_info.sslkey"
          placeholder="-----BEGIN RSA PRIVATE KEY----- ... -----END RSA PRIVATE KEY-----"></el-input>
      </el-form-item>
      <el-form-item label="开启301">
        <el-switch v-model="form2.site_info.extra_kwargs.set_301"></el-switch>
      </el-form-item>
      <el-form-item label="跳转的域名" v-show="form2.site_info.extra_kwargs.set_301">
        <el-input v-model="form2.site_info.domain_301"></el-input>
      </el-form-item>
      <el-form-item label="开启日志">
        <el-switch v-model="form2.site_info.is_log"></el-switch>
      </el-form-item>
      <el-form-item label="额外设置">
        开启404错误页
        <el-switch v-model="form2.site_info.extra_kwargs.set_404"></el-switch>屏蔽非常见UA
        <el-switch v-model="form2.site_info.extra_kwargs.deny_ua"></el-switch>启用防盗链
        <el-switch v-model="form2.site_info.extra_kwargs.deny_referer"></el-switch>安全加固
        <el-switch v-model="form2.site_info.extra_kwargs.safe"></el-switch>开启缓存
        <el-switch v-model="form2.site_info.extra_kwargs.cache"></el-switch>
      </el-form-item>
      <el-form-item label="网站备注">
        <el-input type="textarea" v-model="form2.note"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onUpsite">更新站点</el-button>
        <el-button @click="goback('update')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Site",
  data () {
    return {
      is_sitelist: true,
      is_create: true,
      is_update: false,
      sitelistData: [],
      pages: 1,
      num: 5,
      page: 1,
      total: 1,
      search: "",
      nid: "",
      form: {
        site_name: "",
        bind_domain: "",
        root_path: "",
        ftpinfo: {
          is_create: false,
          ftp_user: ""
        },
        mysqlinfo: {
          is_create: false,
          mysql_user: "",
          mysql_name: "",
          accept: "localhost"
        },
        site_info: {
          is_ssl: false,
          is_log: false,
          log_path: "",
          php_ver: "php5.6",
          domain_301: "",
          sslcrt: "",
          sslkey: "",
          extra_kwargs: {
            rewrite: "",
            set_301: false,
            set_404: false,
            deny_ua: true,
            deny_referer: true,
            safe: true,
            cache: true
          }
        }
      },
      form2: {
        site_info: {
          sslcrt: "",
          sslkey: "",
          extra_kwargs: {}
        }
      },
      ftpmsg: "",
      mysqlmsg: ""
    };
  },
  methods: {
    handleCurrentChange (page) {
      this.page = page;
      this.onGetsite();
    },
    onGetsite () {
      let params = {
        nid: this.nid,
        page: this.page
      };
      this.$http
        .getsite(params)
        .then(res => {
          if (res.errcode === 0) {
            this.sitelistData = res.data;
            this.total = res.total;
            this.page = res.page;
            this.pages = res.pages;
            if (this.nid != "") {
              this.form2 = res.data[0];
              this.is_create = false;
              this.is_update = true;
              this.is_sitelist = false;
            }
          }
        })
        .catch(error => { });
    },
    handleEdit (nid) {
      this.nid = nid;
      this.onGetsite();
    },
    handleDelete (nid) {
      let params = {
        nid: nid
      };
      this.$http
        .delsite(params)
        .then(res => {
          this.errmsg = res.errmsg;
          if (res.errcode === 0) {
            let data = res.data;
            this.onGetsite();
          }
        })
        .catch(error => { });
    },
    onUpsite () {
      if (this.form2.site_info.is_ssl) {
        let formData = new FormData();
        formData.append("crt", this.form2.site_info.sslcrt);
        formData.append("key", this.form2.site_info.sslkey);
        formData.append("site_name", this.form2.site_name);
        formData.append("bind_domain", this.form2.bind_domain);
        this.$http.addssl(formData).then(res => {
          if (res.errcode === 0) {
            this.onUpsite2();
          }
        });
      } else {
        this.onUpsite2();
      }
    },
    onUpsite2 () {
      delete this.form2.status_text;
      delete this.form2.created;
      this.$http
        .upsite(this.form2)
        .then(res => {
          if (res.errcode === 0) {
            let data = res.data;
            this.$message({
              message: "更新站点成功",
              type: "success"
            });
            this.is_create = true;
            this.is_update = false;
            this.is_sitelist = true;
            this.nid = "";
            this.onGetsite();
          }
        })
        .catch(error => { });
    },
    onAddsite () {
      this.errmsg = "";
      if (this.form.ftpinfo.is_create) {
        let params = {
          ftp_user: this.form.ftpinfo.ftp_user,
          ftp_passwd: this.form.ftpinfo.ftp_passwd,
          ftp_path: this.form.root_path
        };
        this.$http.addftp(params).then(res => {
          if (res.errcode === 0) {
            this.ftpmsg = "FTP创建成功,";
          }
        });
      }
      if (this.form.mysqlinfo.is_create) {
        let params = {
          mysql_user: this.form.mysqlinfo.mysql_user,
          mysql_name: this.form.mysqlinfo.mysql_name,
          mysql_passwd: this.form.mysqlinfo.mysql_passwd,
          accept: this.form.mysqlinfo.accept
        };
        this.$http.addmysql(params).then(res => {
          if (res.errcode === 0) {
            this.mysqlmsg = "MYSQL创建成功,";
          }
        });
      }
      if (this.form.site_info.is_ssl) {
        let formData = new FormData();
        formData.append("crt", this.form.site_info.sslcrt);
        formData.append("key", this.form.site_info.sslkey);
        formData.append("site_name", this.form.site_name);
        formData.append("bind_domain", this.form.bind_domain);
        this.$http.addssl(formData).then(res => {
          if (res.errcode === 0) {
            this.onAddsite2();
          }
        });
      } else {
        this.onAddsite2();
      }
    },
    onAddsite2 () {
      this.$http
        .addsite(this.form)
        .then(res => {
          if (res.errcode === 0) {
            this.onGetsite();
            this.$message({
              message: `${this.ftpmsg}${this.mysqlmsg}站点创建成功`,
              type: "success"
            });
          }
        })
        .catch(error => { });
    },
    onGetinfo () {
      this.form.root_path = "/home/wwwroot/" + this.form.site_name;
      this.form.bind_domain = `${this.form.site_name}.com,www.${this.form.site_name}.com`;
      this.form.ftpinfo.ftp_user = this.form.site_name;
      this.form.mysqlinfo.mysql_user = this.form.site_name;
      this.form.mysqlinfo.mysql_name = this.form.site_name;
    },
    goback (flag) {
      if (flag == "update") {
        this.nid = "";
      }
      this.is_update = false;
      this.is_create = true;
      this.is_sitelist = true;
      this.onGetsite(this.nid);
    }
  },
  created () {
    this.onGetsite();
  }
};
</script>

<style scoped>
.site {
  padding: 30px;
  margin-bottom: 30px;
}
</style>