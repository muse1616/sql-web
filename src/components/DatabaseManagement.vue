<!--  -->
<template>
  <div style="overflow-y:hidden">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教师页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><span style="font-weight:bolder">数据库管理</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-row>
      <el-col :span="12">
        <el-tag>当前数据库:{{ id }}</el-tag>
        <el-tag type="success">当前表名:{{ current_table.name }}</el-tag>
        <el-button
          type="danger"
          @click="deleteTable"
          plain
          size="small"
          style="margin-left:10px"
        >
          删除当前表:{{ current_table.name }}
        </el-button>
      </el-col>
      <el-col :span="12"
        ><el-button
          type="primary"
          icon="el-icon-refresh"
          title="刷新"
          circle
          style="float:right"
          @click="refreshDatabase"
        ></el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="3">
        <div style="height: 430px; width:100px">
          <!-- 注意需要给 el-scrollbar 设置高度，判断是否滚动是看它的height判断的 -->
          <el-scrollbar style="height: 100%;">
            <el-aside>
              <el-menu default-active="1">
                <el-menu-item
                  v-for="(item, i) in tables"
                  :key="i"
                  :index="String(i + 1)"
                  @click="showTable(item)"
                >
                  <span slot="title">{{ item }}</span>
                </el-menu-item>
              </el-menu>
            </el-aside>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="21">
        <el-alert title="第二行为字段类型" type="info" show-icon> </el-alert>

        <el-collapse v-model="activeNames">
          <el-collapse-item title="查看表" name="1">
            <!-- 表格区域 -->
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              :header-cell-style="{ background: '#EEF1F6', color: '#606266' }"
            >
              <el-table-column
                align="center"
                v-for="(item, index) in fieldArr"
                :key="index"
                :prop="item"
                :label="item"
              >
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>

        <el-collapse v-model="activeNames">
          <el-collapse-item
            title="脚本创建数据库表"
            name="2"
          >
            <el-upload
              class="upload-demo"
              action=""
              ref="upload"
              :on-change="handleChange"
              :file-list="fileList"
              accept=".sql"
              :auto-upload="false"
              :limit="1"
              :on-exceed="handleExceed"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选择Sql文件</el-button
              >
              <el-button
                size="small"
                type="primary"
                style="margin-left:10px"
                @click="submitScript"
                >上传</el-button
              >
              <div slot="tip" class="el-upload__tip">
                只能上传sql文件，且一次上传一个脚本
              </div>
            </el-upload>
          </el-collapse-item>
        </el-collapse>

        <el-collapse v-model="activeNames">
          <el-collapse-item title="UI创建数据库表" name="3">
            <div class="app-container">
              <el-form
                      :model="dynamicValidateForm"
                      ref="dynamicValidateForm"
                      label-width="100px"
                      class="demo-dynamic">
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                            prop="tableName"
                            label="表名"
                            :rules="[
            { required: true, message: '请输入表名', trigger: 'blur' }]"
                    >
                      <el-input v-model="dynamicValidateForm.tableName" :disabled="tableSubmitted"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-collapse>
                  <el-collapse-item
                    :title="`——第${index + 1}列`"
                    v-for="(row, index) in dynamicValidateForm.rows"
                    :key="index"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item
                                :label="'第' + (index+1) + '列'"
                                :key="row.key"
                                :prop="'rows.' + index + '.column_name'"
                                :rules="{
      required: true, message: '列名不能为空', trigger: 'blur'
      }"
                        >
                          <el-input v-model="row.column_name" :disabled="tableSubmitted"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item
                                :label="'类型'"
                                :key="row.key"
                                :prop="'rows.' + index + '.column_type'"
                                :rules="{
      required: true, message: '类型不能为空', trigger: 'blur'
      }"
                        >
                          <el-select v-model="row.column_type" placeholder="数据类型" :disabled="tableSubmitted">
                            <el-option
                                    v-for="item in types"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item
                                :label="'长度'"
                                :key="row.key"
                                :prop="'rows.' + index + '.column_length'"
                        >
                          <el-input v-model="row.column_length" :disabled="tableSubmitted || !(row.column_type == 'VARCHAR'||row.column_type == 'INT')"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item
                                :label="'属性'"
                                :key="row.key"
                                :prop="'rows.' + index + '.column_attr'">
                          <el-select v-model="row.column_attr" multiple collapse-tags :disabled="tableSubmitted" placeholder="请选择列属性">
                            <el-option
                                    v-for="attr in attrs"
                                    :key="attr"
                                    :label="attr"
                                    :value="attr"
                                    style="max-width: 80%">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-button @click.prevent="removeRow(row)" v-if="!tableSubmitted" style="display: inline">删除</el-button>
                      </el-col>
                    </el-row>

                  </el-collapse-item>
                </el-collapse>

                <el-form-item style="margin-top: 10px">
                  <el-button type="primary" @click="submitForm('dynamicValidateForm')" v-if="!tableSubmitted">提交</el-button>
                  <el-button @click="addDomain" v-if="!tableSubmitted">新增列</el-button>
                  <el-button @click="resetForm('dynamicValidateForm')" v-if="!tableSubmitted">重置</el-button>
                </el-form-item>
              </el-form>

              <div v-if="tableHead.length != 0">
                <el-table
                        :data="uiTableData"
                        style="width: 100%">
                  <template v-for="(item,index) in tableHead">
                    <el-table-column :prop="item.column_name"
                                     :label="item.column_name"
                                     :key="index"
                                     v-if="item.column_name != 'id'">
                      <template slot-scope="scope">
                        <el-input v-if="scope.row.edit && (item.column_type == 'VARCHAR' || item.column_type == 'INT')"
                                  type="text"
                                  v-model="scope.row[item.column_name]"
                                  :placeholder="scope.row[item.column_name]"
                                  :maxlength="item.column_length"
                                  show-word-limit></el-input>
                        <el-date-picker
                                v-else-if="scope.row.edit && item.column_type == 'DATETIME'"
                                v-model="scope.row[item.column_name]"
                                type="date"
                                :placeholder="scope.row[item.column_name]">
                        </el-date-picker>
                        <span v-else>{{scope.row[item.column_name]}}</span>
                      </template>
                    </el-table-column>
                  </template>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.edit" type="text" size="medium" @click="confirmAdd(scope.row)">
                        <i class="el-icon-check" aria-hidden="true"></i>
                      </el-button>
                      <div v-else>
                        <el-button type="text" size="medium" @click="editData(scope.row)">
                          <i class="el-icon-edit" aria-hidden="true"></i>
                        </el-button>
                        <el-button type="text" size="medium" @click="deleteData(scope.row,scope.$index)">
                          <i class="el-icon-delete" aria-hidden="true"></i>
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button @click="addData" style="margin-top: 10px">新增行</el-button>
                <el-divider></el-divider>
                <el-button type="primary" @click="submitData('dynamicValidateForm')">提交</el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    const typeOptions= [{
      value: 'VARCHAR',
      label: 'VARCHAR'
    }, {
      value: 'INT',
      label: 'INT'
    }, {
      value: 'DATETIME',
      label: 'DATETIME'
    }, {
      value: 'BLOB',
      label: 'BLOB'
    }];
    const attrOptions = ['PRIMARY KEY','NOT NULL','UNIQUE'];
    return {
      query: '',
      activeNames: ['1', '2', '3'],
      id: window.localStorage.getItem('user_id'),
      tables: null,
      current_table: {
        name: ''
      },
      fieldArr: [],
      // 显示表的数据
      tableData: [],
      fileList: [],
      script: '',
      types: typeOptions,
      attrs: attrOptions,
      dynamicValidateForm: {
        rows: [{
          column_name: '',
          column_type: '',
          column_length: '',
          column_attr: [],
        }],
        tableName: ''
      },
      uiTableData: [],
      tableHead:[],
      tableSubmitted:false
    };
  },
  methods: {
    async deleteTable() {
      this.$confirm('确定删除当前表？不能还原', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.post('delete/table', {
            id: this.id,
            table: this.current_table.name
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
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    //脚本建表
    async submitScript() {
      const { data: res } = await this.$http.post('script/receive', {
        id: this.id,
        script: this.script
      });
      if (res.status == 200) {
        this.$message.success('上传成功');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (res.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (res.status == 201) {
        this.$message.error('脚本错误:' + res.data);
      } else {
        this.$message.error('服务器错误');
      }
    },
    async beforeUpload(file) {
      // console.log(file.raw);
    },
    handleChange(file, fileList) {
      var _this = this;
      new Promise((resolve, reject) => {
        if (file.raw) {
          let reader = new FileReader();
          reader.onload = function(e) {
            _this.contentHtml = e.target.result;
            // console.log(_this.contentHtml);
            return resolve(_this.contentHtml);
          };
          reader.readAsText(file.raw, 'utf-8');
        }
        this.script = _this.contentHtml;
      }).then(data => {
        this.script = data;
      });
      // console.log('123');
    },

    async refreshDatabase() {
      const { data: res } = await this.$http.post('getTable', { id: this.id });
      if (res.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (res.status == 200) {
        this.$message.success('刷新成功');
        this.tables = res.data;
      } else {
        this.$message.error('未知错误!刷新失败');
      }
    },
    async showTable(name) {
      // 直接返回
      if (name == this.current_table.name) {
        return;
      }
      this.current_table.name = name;
      //   查询表
      const { data: res } = await this.$http.post('getTable/one', {
        id: this.id,
        name: name
      });
      if (res.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (res.status == 200) {
        let type = {};
        this.fieldArr = [];
        this.tableData = [];
        // 遍历field
        for (let key in res.data.field) {
          // 存放
          this.fieldArr.push(key);
          type[key] = res.data.field[key];
        }
        this.tableData[0] = type;
        // console.log(res.data.rows);
        for (let i = 0; i < res.data.rows.length; i++) {
          // 切割字符串
          let rowArr = res.data.rows[i].split('$$$');
          // 最后一项不要
          rowArr.pop();
          // 每一行的对象 key:value
          let rowObj = {};
          for (let j = 0; j < rowArr.length; j++) {
            rowObj[this.fieldArr[j]] = rowArr[j];
          }
          this.tableData[i + 1] = rowObj;

        }
      } else if(res.status == 400){
        this.$message.info('您还没有创建任何实验库表');
      } else {
        this.$message.error('服务器错误');
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeRow(item) {
      let index = this.dynamicValidateForm.rows.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.rows.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.rows.push({
        column_name: '',
        column_type: '',
        column_length: '',
        column_attr: [],
        key: Date.now()
      });
    },
    //添加
    addData() {
      this.uiTableData.push({
        edit: true,
      });
    },
    //确认添加
    confirmAdd(row) {
      row.edit = false;
    },
    //修改
    editData(row) {
      row.edit = true;
    },
    //删除
    deleteData(row, index) {
      this.uiTableData.splice(index, 1);
    },
    //创建列
    async submitForm(formName) {
      let strTable = '';
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //将已设定的列属性作为表头显示
          this.tableHead = this.dynamicValidateForm.rows;
          strTable += "CREATE TABLE IF NOT EXISTS \`" + this.dynamicValidateForm.tableName + "\`" + "\(\n"
          for(let i =0;i<this.tableHead.length;i++){
            strTable += this.tableHead[i].column_name + " " + this.tableHead[i].column_type;
            if(this.tableHead[i].column_length != null){
              strTable += '\('+ this.tableHead[i].column_length +'\)'
            }
            strTable += " ";
            for(let j =0;j<this.tableHead[i].column_attr.length;j++){
              strTable += this.tableHead[i].column_attr[j] + ' ';
            }
            if(i<this.tableHead.length-1){
              strTable += "\,"
            }
            strTable += "\n"
          }
          strTable += "\)\;"
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      const { data: res } = await this.$http.post('script/receive', {
        id: this.id,
        script: strTable
      });
      if (res.status == 200) {
        this.$message.success('建表成功');
        this.tableSubmitted = true;
      } else if (res.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (res.status == 201) {
        this.$message.error('脚本错误:' + res.data);
      } else {
        this.$message.error('服务器错误');
      }
    },
    //创建行
    async submitData(formName) {
      let strTable = '';

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableHead = this.dynamicValidateForm.rows;
          this.tableSubmitted = true;

          for(let i = 0;i < this.uiTableData.length;i++){
            strTable += 'INSERT INTO ' + this.dynamicValidateForm.tableName + ' VALUES \(';
            for(let j =0;j < this.tableHead.length;j++){
              strTable += '\'' + this.uiTableData[i][this.tableHead[j].column_name] + '\'';
              if(j<this.tableHead.length-1){
                strTable += ',';
              }
            }
            strTable += '\);\n'
          }

          alert(strTable)
        } else {
          console.log('error submit!!');
          return false;
        }
      });

      const { data: res } = await this.$http.post('script/receive', {
        id: this.id,
        script: strTable
      });
      if (res.status == 200) {
        this.$message.success('插入字段成功');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (res.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (res.status == 201) {
        this.$message.error('脚本错误:' + res.data);
      } else {
        this.$message.error('服务器错误');
      }
    },
  },
  async created() {
    if (this.id == null) {
      // 重定向到登录页
      return this.$router.push('/login');
    }
    const { data: res } = await this.$http.post('getTable', { id: this.id });
    if (res.status == 202) {
      this.$message.error('登录状态已失效!请先登录');
      // 重定向到登录页
      this.$router.push('/login');
    } else if (res.status == 200) {
      this.$message.success('连接数据库成功');
      this.tables = res.data;
      // this.current_table.name = this.tables[0];
      // console.log(this.tables[0]);
      this.showTable(this.tables[0]);
      this.current_table.name = this.tables[0];
    } else {
      this.$message.error('未知错误!连接数据库失败');
    }
  }
};
</script>
<style scoped>
</style>
