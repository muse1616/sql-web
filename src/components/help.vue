<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户</el-breadcrumb-item>
      <el-breadcrumb-item
        ><span style="font-weight:bolder">使用帮助</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <h1>学生端</h1>
    <blockquote >
      实验过程中,学生使用表格为临时创建用表,且前后对表的操作会互相影响，使用刷新按钮可重置表格,作答时，无需关注多余空格或答案前后的空格,在批改时系统会自动校验空格的数量
    </blockquote>
    <el-divider></el-divider>
    <h1>教师端</h1>
     <blockquote >
        教师账号在管理员添加后,自动生成一系列管理班级、数据库、实验的表格,无需手动创建,在创建表时,应避免使用双下划线作为表名
       开头,默认为系统自带表格,在创建表的数据单元时,禁止使用'$$$'这一字符组合
    </blockquote>
   <el-divider></el-divider>
    <h1>源码</h1>
     <blockquote >
       
    </blockquote>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>
<style scoped></style>
