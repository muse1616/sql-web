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
        <el-alert title="第二行为字段类型"  type="info" show-icon> </el-alert>

        <el-collapse v-model="activeNames">
          <el-collapse-item title="收起" name="1">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['1'],
      id: window.localStorage.getItem('user_id'),
      tables: null,
      current_table: {
        name: ''
      },
      fieldArr: [],
      // 显示表的数据
      tableData: [{}]
    };
  },
  methods: {
    async refreshDatabase() {
      const { data: res } = await this.$http.post('getTable', { id: this.id });
      if (res.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (res.status == 200) {
        this.$message.success('刷新成功');
        this.tables = res.data;
        // this.current_table.name = res.data[0];
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
          // console.log(rowArr);

          // console.log(res.data.rows[i]);
        }
      } else {
        this.$message.error('服务器错误');
      }
    }
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
<style scoped></style>
