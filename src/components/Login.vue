<template>
  <div class="login_container" :style="bkg">
    <!-- 登录盒 -->
    <div class="login_box">
      <div class="title">SQL-LAB 登录</div>
      <!-- 表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        class="login_form"
      >
        <!-- 用户名  prop:校验规则-->
        <el-form-item prop="id">
          <el-input
            v-model="loginForm.id"
            prefix-icon="el-icon-user-solid"
            placeholder="输入学号/工号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="pwd">
          <el-input
            type="password"
            v-model="loginForm.pwd"
            prefix-icon="el-icon-lock"
            placeholder="输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 账号类型 -->
        <el-select v-model="t" placeholder="账号类型">
          <el-option
            v-for="item in typeArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button @click="login" plain>登录</el-button>
          <!-- 绑定重置事件 -->
          <el-button type="info" @click="resetLoginForm" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      t: 'student',
      typeArr: [
        {
          value: 'student',
          label: '学生'
        },
        {
          value: 'teacher',
          label: '教师'
        }
      ],
      // 背景
      bkg: {
        backgroundImage: 'url(' + require('../assets/img/bkg.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      // 登录表单数据绑定对象
      loginForm: {
        id: '',
        pwd: ''
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        id: [
          { required: true, message: '请输入登录学号/工号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在6到10个字符之间', trigger: 'blur' }
        ],
        // 验证密码是否合法
        pwd: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 点击重置按钮 重置表单
    resetLoginForm() {
      // 获取ref
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 提交前验证 第一个参数为bool 验证结果
      this.$refs.loginFormRef.validate(async valid => {
        // 不合法直接return 不发起请求
        if (!valid) return;
        this.loginForm['type'] = this.t;
        // 发起登录请求  解构赋值
        const { data: res } = await this.$http.post('login', this.loginForm);
        // 登录判断
        if (res.status != 200) {
          return this.$message.error('登录失败!账号或密码错误');
        }
        // console.log(res);
        this.$message.success('登录成功');
        // 保存token到sessionStorage
        window.sessionStorage.setItem('token', res.token);
        // 判断账号类型 通过编程式导航跳转到主页
        if (this.t == 'teacher') {
          window.localStorage.setItem('user_id', res.meta.data.id);
          this.$router.push({ name: '/teacher/home', params: res.meta.data });
        }
        // 学生
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
}
.title {
  text-align: center;
  padding-top: 40px;
  font-weight: bolder;
  font-size: 30px;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  // 位移
  transform: translate(-50%, -60%);
}
.btns {
  float: right;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
}
</style>
