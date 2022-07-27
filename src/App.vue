<template>
  <div class="header">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      v-if="userInfo.token">
      <el-menu-item v-for="(item) in navList" :key="item.id" index="item.id">
        <router-link :to="{ name: item.name }">{{ item.title }}</router-link>
      </el-menu-item>
      <el-menu-item>
        <a href @click="logout">退出</a>
      </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data () {
    return {
      navList: [
        { id: 1, title: "首页", name: "Home" },
        { id: 2, title: "站点", name: "Site" },
        { id: 3, title: "FTP", name: "Ftp" },
        { id: 4, title: "MYSQL", name: "Mysql" },
        { id: 5, title: "软件", name: "Soft" }
      ],
      activeIndex: ""
    };
  },
  methods: {
    handleSelect (key, keyPath) { },
    logout () {
      console.log("logout");
      localStorage.clear();
      this.$store.dispatch("accountLogout");
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo;
    }
  }
};
</script>

<style>
</style>