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
      title="注意!删除班级操作会注销该班级中所有学生的注册"
      type="warning"
      show-icon
    >
    </el-alert>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>班级列表</span>
        <el-button
          style="float: right"
          size="mini"
          type="primary"
          @click="dialogFormVisible1 = true"
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

    <!-- 模态框 -->
    <el-dialog title="添加学生(单个)" :visible.sync="dialogFormVisible">
      <el-form :model="singleStudent">
        <el-form-item label="当前班级">
          <el-input
            v-model="singleStudent.class"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="singleStudent.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="singleStudent.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddStudentDialog">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 班级模态 -->
    <el-dialog title="导入班级" :visible.sync="dialogFormVisible1">
      <el-form>
        <el-form-item label="班级号">
          <el-input v-model="classId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <el-alert
        title="文件规格说明,示例图如下"
        type="info"
        description="选择xls或xlsx文件,班级表格在sheet1,第一行表头分别为id与name"
        show-icon
      >
      </el-alert>
      <img id="xls_example" src="../assets/img/xls_example.png" alt="" />
      <!-- 导入xls -->
      <el-upload
        ref="upload"
        action="/"
        :show-file-list="true"
        :on-change="importExcel"
        :auto-upload="false"
        :limit="1"
      >
        <el-button icon="el-icon-upload" size="small" type="primary">
          选择xls/xlsx文件
        </el-button>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeImportClassDialog">取 消</el-button>
        <el-button type="primary" @click="importAClass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 使用xlss解析
import XLSX from 'xlsx';
export default {
  data() {
    return {
      id: window.localStorage.getItem('user_id'),
      class: [],
      tableData: [],
      index: '0',
      student: [],
      dialogFormVisible: false,
      dialogFormVisible1: false,
      singleStudent: {
        id: '',
        name: '',
        class: ''
      },
      formLabelWidth: '120px',
      classXls: [],
      classId: '',
      canSubmit: false
    };
  },
  methods: {
    importExcel(file) {
      this.classXls = [];
      const types = file.name.split('.')[1];
      const fileType = ['xlsx', 'xls'].some(item => item === types);
      if (!fileType) {
        this.$message('格式错误！请重新选择');
        return;
      }
      this.file2Xce(file).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          // 检查属性

          this.xlsxJson = tabJson;

          if (Object.keys(this.xlsxJson[0].sheet[0]).toString() == 'id,name') {
            for (let i = 0; i < this.xlsxJson[0].sheet.length; i++) {
              let sObj = {
                id: this.xlsxJson[0].sheet[i].id,
                name: this.xlsxJson[0].sheet[i].name
              };
              this.classXls.push(sObj);
            }
          } else {
            return this.$message('xls格式错误！请重新选择');
          }
        }
      });
    },
    file2Xce(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const data = e.target.result;
          this.wb = XLSX.read(data, {
            type: 'binary'
          });
          const result = [];
          this.wb.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
            });
          });
          resolve(result);
        };
        reader.readAsBinaryString(file.raw);
      });
    },
    closeImportClassDialog() {
      this.dialogFormVisible1 = false;
    },
    importAClass() {
      if (this.classId == '' || this.classXls.length == 0) {
        return this.$message.error('信息不完整');
      }

      // 处理班级中的重复情况 id重复直接返回 不发送请求 前端判断
      let tempArr = [];
      for (let i = 0; i < this.classXls.length; i++) {
        if (i == 0) {
          tempArr.push(this.classXls[i]);
        } else {
          let bool = true;
          for (let j = 0; j < tempArr.length; j++) {
            if (tempArr[j].id == this.classXls[i].id) {
              bool = false;
              break;
            }
          }
          if (bool == true) {
            tempArr.push(this.classXls[i]);
          }
        }
      }
      this.$confirm(
        '导入班级同时为其中学生注册(自动过滤id相同学生,取第一个该id的同学), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const { data: res } = await this.$http.post('import/class', {
            id: this.id,
            class_id: this.classId,
            classObj: tempArr
          });
          if (res.status == 200) {
            this.$message.success(res.data);
             setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else if (res.status == 202) {
            this.$message.error('登录状态已失效!请先登录');
            // 重定向到登录页
            this.$router.push('/login');
          } else {
            this.$message.error('未知错误');
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    submitAdd() {
      if (
        this.singleStudent.id == '' ||
        this.singleStudent.name == '' ||
        this.singleStudent.class == ''
      ) {
        return this.$message.error('信息填写不完整');
      }
      // 提交信息
      this.$confirm('添加该学生同时为其注册, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // console.log(row.id);
          const { data: res } = await this.$http.post('add/student', {
            id: this.id,
            student: this.singleStudent
          });
          if (res.status == 200) {
            this.$message.success('添加成功');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else if (res.status == 202) {
            this.$message.error('登录状态已失效!请先登录');
            // 重定向到登录页
            this.$router.push('/login');
          } else if (res.status == 400) {
            this.$message.error(res.data);
          } else if (res.status == 201) {
            this.$message.error(res.data);
          } else {
            this.$message.error('未知错误');
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    closeAddStudentDialog() {
      this.dialogFormVisible = false;
      // 清空表单内容
      this.singleStudent.id = '';
      this.singleStudent.name = '';
      this.singleStudent.class = '';
    },
    addOneStudent(row) {
      this.singleStudent.class = row.id;
      this.dialogFormVisible = true;
    },
    deleteClass(row) {
      this.$confirm(
        '此操作将永久删除该班级所有同学并注销注册, 是否继续?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const { data: res } = await this.$http.post('delete/class', {
            id: this.id,
            class_id: row.id
          });
          if (res.status == 200) {
            this.$message.success('删除成功');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else if (res.status == 202) {
            this.$message.error('登录状态已失效!请先登录');
            // 重定向到登录页
            this.$router.push('/login');
          } else if (res.status == 400) {
            this.$message.error(res.data);
          } else {
            this.$message.error('未知错误');
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    async deleteOneStudent(row) {
      this.$confirm('此操作将永久删除该学生并注销其注册, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // console.log(row.id);
          const { data: res } = await this.$http.post('delete/student', {
            id: this.id,
            student_id: row.id
          });
          if (res.status == 200) {
            this.$message.success('删除成功');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else if (res.status == 202) {
            this.$message.error('登录状态已失效!请先登录');
            // 重定向到登录页
            this.$router.push('/login');
          } else if (res.status == 400) {
            this.$message.error('服务器错误:' + res.data);
          } else {
            this.$message.error('未知错误');
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
<style scoped>
#xls_example {
  width: 70%;
}
</style>
