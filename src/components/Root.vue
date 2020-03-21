<!--  -->
<template>
  <div>
    <el-form :model="form" :rules="formRules" ref="formRef">
      <el-form-item prop="pwd">
        <el-input
          v-model="form.pwd"
          show-password
          prefix-icon="el-icon-lock"
          placeholder="管理员密码"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item prop="teacher_id">
        <el-input
          v-model="form.teacher_id"
          prefix-icon="el-icon-user-solid"
          placeholder="教师账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="teacher_name">
        <el-input
          v-model="form.teacher_name"
          prefix-icon="el-icon-user-solid"
          placeholder="教师姓名"
        ></el-input>
      </el-form-item>

      <!-- 按钮区域 -->
      <el-form-item class="btns">
        <el-button @click="add" plain>添加</el-button>
        <!-- 绑定重置事件 -->
        <el-button type="info" @click="resetForm" plain>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        pwd: '',
        teacher_id: '',
        teacher_name: ''
      },
      // 表单验证规则对象
      formRules: {
        // 验证用户名是否合法
        pwd: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在6到20个字符之间', trigger: 'blur' }
        ],
        // 验证密码是否合法
        teacher_id: [
          { required: true, message: '请输入教师账号', trigger: 'blur' }
        ],
        teacher_name: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    async add() {
      // 提交前验证 第一个参数为bool 验证结果
      this.$refs.formRef.validate(async valid => {
        // 不合法直接return 不发起请求
        if (!valid) return;
        const { data: res } = await this.$http.post('root/add', {
          form: this.form
        });
        if (res.status == 200) {
          this.$message.success('创建成功');
        } else if (res.status == 201) {
          this.$message.error(res.data);
        } else {
          this.$message.error('服务器错误 稍后再试');
        }
      });
    },
    resetForm() {
      // 获取ref
      this.$refs.formRef.resetFields();
    }
  }
};
</script>
<style scoped></style>
