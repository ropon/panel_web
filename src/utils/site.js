export function addftp(params) {
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
    });
}