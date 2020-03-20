<!--  -->
<template>
  <div>
    <div>
      正在作答:{{ $route.params.test_name }}
      <el-button style="float:right" type="text" @click="drawer = true">
        点击弹出sql语句测试面板
      </el-button>
      <el-alert
        title="运行SQL使用临时库表,不会影响原表"
        @click="drawer = true"
        type="info"
        show-icon
      >
      </el-alert>
    </div>

    <el-divider></el-divider>

    <el-collapse>
      <el-collapse-item title="打开实验关联库表">
        <!-- 渲染库表 -->
        <el-tabs type="border-card">
          <el-tab-pane
            v-for="(i, index1) in tableName"
            :key="index1"
            :label="i"
          >
            <!-- 表格区域 -->
            <el-table
              :data="tableData[index1]"
              border
              style="width: 100%"
              :header-cell-style="{ background: '#EEF1F6', color: '#606266' }"
            >
              <el-table-column
                align="center"
                v-for="(item2, index2) in fieldArr[index1]"
                :key="index2"
                :prop="item2"
                :label="item2"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-collapse-item>
    </el-collapse>

    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :with-header="false"
      size="50%"
    >
      <div style="margin-left:40px;margin-top:30px">
        <el-button type="primary" size="mini" @click="runSql"
          ><i class="el-icon-check"></i>执行SQL语句</el-button
        >
        <el-button size="mini" @click="refreshTempDb"
          ><i class="el-icon-refresh"></i>刷新临时库表</el-button
        >
      </div>
      <!-- 调试sql -->
      <el-input
        type="textarea"
        :rows="3"
        v-model="sql_test"
        resize="none"
        style="padding-left:40px;padding-right:40px;margin-top:5px"
        placeholder="输入MYSQL语句"
        spellcheck="false"
      ></el-input>

      <!-- 结果区域 -->
      <div v-if="sql_type == 1" style="margin-left:40px;margin-top:30px">
        运行结果:
        <span>{{ sql_result }}</span>
      </div>

      <!-- 结果区域 -->
      <div v-else-if="sql_type == 2" style="margin-left:40px;margin-top:30px">
        运行结果:
        <el-alert
          title="鼠标滑轮控制列表显示"
          type="info"
          show-icon
          style="width:80%"
        >
        </el-alert>
        <el-table
          :data="sql_table"
          border
          style="width: 90%"
          :header-cell-style="{
            background: '#EEF1F6',
            color: '#606266'
          }"
          max-height="300"
        >
          <el-table-column
            align="center"
            v-for="(item, index) in fieldArr2"
            :key="index"
            :prop="item"
            :label="item"
            fixed
          >
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <!-- /end -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableName: {},
      tableData: [],
      fileList: [],
      fieldArr: [],
      drawer: false,
      sql_result: '',
      sql_table: '',
      sql_type: '',
      sql_test: '',
      fieldArr2: []
    };
  },
  methods: {
    async runSql() {
      if (this.sql_test == '') {
        return this.$message({
          type: 'warning',
          message: '语句不能为空'
        });
      }

      const { data: res } = await this.$http.post('runTestSql', {
        id: window.localStorage.getItem('user_id'),
        teacher_id: window.localStorage.getItem('teacher_id'),
        test_name: this.$route.params.test_name,
        sql: this.sql_test
      });
      // 渲染结果
      if (res.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (res.status == 200) {
        if (res.data.type == 1) {
          this.sql_type = 1;
          this.sql_result = res.data.msg;
        } else if (res.data.type == 2) {
          // 渲染表格
          this.sql_type = 2;
          this.fieldArr2 = [];
          this.sql_table = [];
          // 遍历field
          for (let key of res.data.msg.fields) {
            // 存放
            this.fieldArr2.push(key);
          }
          for (let i = 0; i < res.data.msg.rows.length; i++) {
            // 切割字符串
            let rowArr = res.data.msg.rows[i].split('$$$');
            // 最后一项不要
            rowArr.pop();
            // 每一行的对象 key:value
            let rowObj = {};
            for (let j = 0; j < rowArr.length; j++) {
              rowObj[this.fieldArr2[j]] = rowArr[j];
            }
            this.sql_table[i + 1] = rowObj;
          }
        }
      } else if (res.status == 201) {
        this.sql_type = 1;
        this.sql_result = res.data;
      } else {
        this.$message.error('服务器错误');
      }
    },
    async refreshTempDb() {
      // 创建临时表库
      const { data: r } = await this.$http.post('/test/createTmpTable', {
        id: window.localStorage.getItem('user_id'),
        teacher_id: window.localStorage.getItem('teacher_id'),
        test_name: this.$route.params.test_name
      });
      if (r.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (r.status == 200) {
        this.$message.success('成功刷新临时表');
      } else {
        this.$message.error('刷新临时表失败');
      }
    }
  },
  beforeRouteLeave: function(to, from, next) {
    next(false);
    this.$confirm('您将离开本页面，作答记录不会保存,继续离开？', '提示', {
      distinguishCancelAndClose: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        //   删除临时表
        //   可以不进行删除？

        next();
      })
      .catch(() => {});
  },
  mounted() {
    window.onbeforeunload = function(e) {
      e = e || window.event;
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = '关闭提示';
      }
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return '关闭提示';
    };
  },
  destroyed() {
    window.onbeforeunload = null;
  },
  async created() {
    if (
      window.localStorage.getItem('user_id') == '' ||
      window.localStorage.getItem('teacher_id') == ''
    ) {
      this.$message.error('登录状态已失效!请先登录');
      // 重定向到登录页
      this.$router.push('/login');
    }

    //   请求实验数据
    const { data: res } = await this.$http.post('testing', {
      teacher_id: window.localStorage.getItem('teacher_id'),
      test_name: this.$route.params.test_name
    });

    if (res.status == 202) {
      this.$message.error('登录状态已失效!请先登录');
      // 重定向到登录页
      this.$router.push('/login');
    } else if (res.status == 200) {
      this.tableName = [];

      for (let i = 0; i < res.data.tables.length; i++) {
        this.tableName.push(res.data.tables[i].tableName);

        let type = {};
        // this.fieldArr = [];
        let Atable = [];
        // 遍历field
        let temp = [];
        for (let key in res.data.tables[i].field) {
          // 存放
          temp.push(key);
          type[key] = res.data.tables[i].field[key];
        }
        this.fieldArr.push(temp);
        Atable[0] = type;

        for (let j = 0; j < res.data.tables[i].rows.length; j++) {
          // 切割字符串
          let rowArr = res.data.tables[i].rows[j].split('$$$');
          // 最后一项不要
          rowArr.pop();
          // 每一行的对象 key:value
          let rowObj = {};

          for (let k = 0; k < rowArr.length; k++) {
            rowObj[temp[k]] = rowArr[k];
          }
          Atable[j + 1] = rowObj;
        }

        this.tableData.push(Atable);
      }
      // 创建临时表库
      const { data: r } = await this.$http.post('/test/createTmpTable', {
        id: window.localStorage.getItem('user_id'),
        teacher_id: window.localStorage.getItem('teacher_id'),
        test_name: this.$route.params.test_name
      });
      if (r.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (r.status == 200) {
        this.$message.success('成功加载临时表');
      } else {
        this.$message.error('加载临时表失败');
      }
    }
  }
};
</script>
<style scoped></style>
