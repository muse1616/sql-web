<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教师页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><span style="font-weight:bolder">班级管理</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-alert
      title="注意!删除班级操作目前不会注销学生的注册"
      type="warning"
      show-icon
    >
    </el-alert>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>班级列表</span>
        <el-button style="float: right" size="mini" type="primary"
          >导入班级</el-button
        >
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="班级" align="center">
        </el-table-column>
        <el-table-column prop="number" label="人数" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="addOneStudent(scope.row)"
              type="primary"
              size="small"
              >增加(单个)</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteClass(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>
      <el-tabs v-model="index">
        <el-tab-pane
          v-for="(item, index) in tableData"
          :key="index"
          :label="item.id"
          :name="index + ''"
          style="margin-left:10px"
        >
          <!-- 学生表格 -->
          <el-table :data="student[index]" style="width: 100%">
            <el-table-column
              prop="id"
              label="学号"
              align="center"
              width="200px"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              width="200px"
            >
            </el-table-column>
            <el-table-column label="操作" align="center" width="250px">
              <template slot-scope="scope">
                <el-button
                  @click="deleteOneStudent(scope.row)"
                  type="danger"
                  size="small"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: window.localStorage.getItem('user_id'),
      class: [],
      tableData: [],
      index: '0',
      student: []
    };
  },
  methods: {
    addOneStudent(row) {
      console.log(row);
    },
    deleteClass(row) {
      console.log(row);
    },
    deleteOneStudent(row) {
      // 删除的id
      console.log(row.id);
    }
  },

  async created() {
    // 获得班级
    const { data: res } = await this.$http.post('getClass', {
      id: this.id
    });
    if (res.status == 200) {
      // 先渲染班级表格
      // console.log(res.data[0]);
      for (let i = 0; i < res.data.length; i++) {
        let AClass = {};
        AClass.id = res.data[i].class_id;
        AClass.number = res.data[i].student.length;
        this.tableData.push(AClass);
        // 遍历学生
        let arr = res.data[i].student;
        this.student.push(arr);
        // console.log(res.data[i].student[0]);
      }
    } else if (res.status == 202) {
      this.$message.error('登录状态已失效!请先登录');
      // 重定向到登录页
      this.$router.push('/login');
    } else {
      this.$message.error('服务器错误');
    }
  }
};
</script>
<style scoped></style>
