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
          <el-submenu index="">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>实验列表</span>
            </template>
            <el-menu-item
              :index="`/student/home/test/get/${i.id}`"
              v-for="(i, index) in testList"
              :key="index"
              >{{ i.name }}</el-menu-item
            >
          </el-submenu>

          <el-menu-item index="/student/home/test/history">
            <i class="el-icon-edit"></i>
            <span slot="title">作答情况</span>
          </el-menu-item>


          <el-menu-item index="/student/home/profile">
            <i class="el-icon-user-solid"></i>
            <span slot="title">账号管理</span>
          </el-menu-item>

          <el-menu-item index="/student/home/help">
            <i class="el-icon-question"></i>
            <span slot="title">使用帮助</span>
          </el-menu-item>

          <el-menu-item @click="logout">
            <i class="el-icon-switch-button"></i>
            <span slot="title">退出登录</span>
          </el-menu-item>
        </el-menu>
        <div id="current_id">
          <div style="padding-left:5px">欢迎</div>
          <div>{{ user_name }}</div>
        </div>
      </el-aside>
      <!-- 右侧内容区域 -->
      <div id="logout_button"></div>
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
      id: window.localStorage.getItem('user_id'),
      user_name: window.localStorage.getItem('user_name'),
      testList: []
    };
  },
  methods: {
    // 退出登录
    logout() {
      this.$confirm('退出登录？是否继续', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 清空sessionStorage
          window.sessionStorage.clear();
          window.localStorage.clear();
          // 重定向到登录页
          this.$router.push('/login');
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    }
  },
  async created() {
    if (this.id == null) {
      // 重定向到登录页
      this.$router.push('/login');
    }
    // 获取当前可见的实验列表
    const { data: res } = await this.$http.post('getVisibleExperiment', {
      student_id: window.localStorage.getItem('user_id')
    });
    // 状态码判断
    if (res.status == 202) {
      this.$message.error('登录状态已失效!请先登录');
      // 重定向到登录页
      this.$router.push('/login');
    } else if (res.status == 200) {
      this.testList = res.data;
    } else {
      return this.$message.error('未知错误');
    }
  }
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
