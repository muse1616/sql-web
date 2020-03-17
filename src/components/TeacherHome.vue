<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <div><img src="../assets/img/db.png" id="title_img" alt="" /></div>
      </div>
      <h1 id="title">数据库实验</h1>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu :router="true">
          <el-menu-item index="/teacher/home/experiment/create">
            <i class="el-icon-folder-add"></i>
            <span slot="title">实验创建</span>
          </el-menu-item>
          <el-menu-item index="/teacher/home/database/management">
            <i class="el-icon-menu"></i>
            <span slot="title">数据库管理</span>
          </el-menu-item>
          <el-menu-item index="/teacher/home/experiment/management">
            <i class="el-icon-search"></i>
            <span slot="title">实验管理</span>
          </el-menu-item>
          <el-menu-item index="/teacher/home/class/management">
            <i class="el-icon-s-custom"></i>
            <span slot="title">班级管理</span>
          </el-menu-item>
          <el-menu-item index="/teacher/home/grade">
            <i class="el-icon-s-data"></i>
            <span slot="title">成绩导出</span>
          </el-menu-item>
          <el-menu-item index="/teacher/home/profile">
            <i class="el-icon-user-solid"></i>
            <span slot="title">账号管理</span>
          </el-menu-item>
          <el-menu-item index="/teacher/home/help">
            <i class="el-icon-question"></i>
            <span slot="title">使用帮助</span>
          </el-menu-item>
          <el-menu-item @click="logout">
            <i class="el-icon-switch-button"></i>
            <span slot="title">退出登录</span>
          </el-menu-item>
        </el-menu>
        <div id="current_id">
          <div>当前账号:</div>
          <div>{{ id }}</div>
        </div>
      </el-aside>
      <!-- 右侧内容区域 -->
      <div id="logout_button">
        <!-- <el-button type="primary" @click="logout">退出</el-button> -->
      </div>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 接受参数
      id: window.localStorage.getItem('user_id')
    };
  },
  methods: {
    // 退出登录
    logout() {
      // 清空sessionStorage
      window.sessionStorage.clear();
      window.localStorage.clear();
      // 重定向到登录页
      this.$router.push('/login');
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #ffffff;
  border-bottom: solid 1px #dcdfe6;
  display: flex;
  //   justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-menu-demo {
  width: 100%;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #ffffff;
}
.home-container {
  height: 100%;
}
#current_id {
  padding-top: 10px;
  padding-right: 10px;
}
.el-aside {
  background-color: #fff;
}
#title_img {
  height: 40px;
  width: 40px;
}
#title {
  color: #409eff;
  font-weight: bolder;
  font-size: 30px;
  padding-left: 10px;
}
#logout_button {
  display: block;
  float: right;
}
#current_id {
  padding-left: 30px;
  text-align: left;
  color: #409eff;
}
</style>
