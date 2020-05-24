<!--  -->
<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>学生页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><span style="font-weight:bolder">实验信息</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>实验名:{{ info.name }}</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="startTest"
          >开始作答</el-button
        >
      </div>
      <el-alert title="该实验可任意次数作答" type="info" show-icon> </el-alert>

      <el-form
        :model="info"
        label-width="150px"
        style="margin-top:10px"
        disabled
      >
        <el-form-item label="实验目的">
          <el-input v-model="info.aim"></el-input>
        </el-form-item>
        <el-form-item label="实验描述">
          <el-input v-model="info.describe"></el-input>
        </el-form-item>
        <el-form-item label="关联库表">
          <el-input v-model="info.table"></el-input>
        </el-form-item>
        <el-form-item label="实验截止日期">
          <el-input v-model="info.deadline"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import format from '../utils/date';
export default {
  data() {
    return {
      id: window.localStorage.getItem('user_id'),
      teacher_id: window.localStorage.getItem('teacher_id'),
      info: {},
      test_id: null
    };
  },

  methods: {

    startTest() {
      this.$confirm('确定开始作答？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.$router.push('/student/home/test/start/' + this.test_id);
          // console.log(123);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    }
  },
  watch: {
    async '$route'(to, from) {
      //做一些路由变化的响应
      const {data: res1} = await this.$http.post('getExperimentInfo', {
        exp_id: this.$route.params.test_id
      });
    },
    async test_id(val) {
      // 请求实验数据
      const { data: res } = await this.$http.post('getExperimentInfo', {
        exp_id: this.test_id
      });
      // 状态码判断
      if (res.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (res.status == 200) {
        this.info = res.data;
      } else if (res.status == 400) {
        this.$message.error('服务器错误');
        // 重定向到主页
        this.$router.push('/student/home');
      }
    }
  },
  computed: {
    test_id() {
      return this.$route.params.test_id;
    }
  },
  async created() {

    this.test_id = this.$route.params.test_id;
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
    } else {
      return this.$message.error('未知错误');
    }

    const { data: res1 } = await this.$http.post('getExperimentInfo', {
      exp_id: this.test_id
    });
    // 状态码判断
    if (res1.status == 202) {
      this.$message.error('登录状态已失效!请先登录');
      // 重定向到登录页
      this.$router.push('/login');
    } else if (res1.status == 200) {
      this.info = res1.data;
    } else if (res1.status == 400) {
      this.$message.error('服务器错误');
      // 重定向到主页
      this.$router.push('/student/home');
    }
  }
};
</script>
<style scoped></style>
