<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教师页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><span style="font-weight:bolder">账号管理</span></el-breadcrumb-item
      >
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-form ref="ref" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="当前账号">
          <el-input v-model="form.id" disabled=""></el-input>
        </el-form-item>

        <!-- 当前密码 -->
        <el-form-item prop="old_pwd" label="当前密码">
          <el-input
            type="password"
            v-model="form.old_pwd"
            show-password
          ></el-input>
        </el-form-item>

        <!-- 修改密码 -->
        <el-form-item prop="new_pwd" label="修改密码">
          <el-input
            type="password"
            v-model="form.new_pwd"
            show-password
          ></el-input>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item prop="check_pwd" label="确认密码">
          <el-input
            type="password"
            v-model="form.check_pwd"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class='btns'>
          <el-button plain @click="renew">确认修改</el-button>
          <el-button plain @click="$refs.ref.resetFields()">重置表单</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //   校验两次密码是否一致
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.new_pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        id: window.localStorage.getItem('user_id'),
        old_pwd: '',
        new_pwd: '',
        check_pwd: ''
      },

      // 表单验证规则对象
      formRules: {
        // 验证密码
        old_pwd: [
          { required: true, message: '请输入当前密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        // 验证密码是否合法
        new_pwd: [
          { required: true, message: '请输入修改密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        check_pwd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    renew() {
      // 提交前验证 第一个参数为bool 验证结果
      this.$refs.ref.validate(async valid => {
        // 不合法直接return 不发起请求
        if (!valid) return;
        this.form['type'] = 'teacher';
        // 发送请求
        const { data: res } = await this.$http.post('changepwd', this.form);

        // 状态码判断
        if (res.status == 202) {
          this.$message.error('登录状态已失效!请先登录');
          // 重定向到登录页
          this.$router.push('/login');
        } else if (res.status == 201) {
          return this.$message.error('密码错误');
        } else if (res.status == 400) {
          return this.$message.error('服务器错误');
        } else if (res.status == 200) {
          this.$message.success('修改成功');
          //   重置表单
          this.$refs.ref.resetFields();
          return;
        } else {
          return this.$message.error('未知错误');
        }
      });
    }
  },
  created() {
    if (this.form.id == null) {
      // 重定向到登录页
      this.$router.push('/login');
    }
  }
};
</script>
<style scoped>
.el-input {
  width: 40%;
}
.btns{
    margin-left:50px;
}
</style>
