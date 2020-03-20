<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教师页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><span style="font-weight:bolder">成绩导出</span></el-breadcrumb-item
      >
    </el-breadcrumb>

    选择班级
    <el-select v-model="current_class" placeholder="请选择">
      <el-option
        v-for="item in classOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-button type="primary" @click="getGrade">查询</el-button>
    <el-button type="success" @click="exportGrade" v-if="show == true"
      >导出</el-button
    >

    <el-table :data="current_table" height="300" id="out-table">
      <el-table-column
        :prop="item"
        v-for="(item, index) in head"
        :key="index"
        :label="item"
        align="center"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
export default {
  data() {
    return {
      id: window.localStorage.getItem('user_id'),
      classOption: [],
      current_class: '',
      current_table: [],
      out_class:'',
      head: [],
      show: false
    };
  },
  methods: {
    exportGrade() {
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'));
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          //设置导出文件名称
          this.out_class+'--成绩.xlsx'
        );
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout);
      }
      return wbout;
    },
    async getGrade() {
      if (this.current_class == '') {
        return this.$message({
          type: 'warning',
          message: '请选择班级'
        });
      }
      this.show = true;
      const { data: res } = await this.$http.post('getGrade', {
        id: this.id,
        class_id: this.current_class
      });
      if (res.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (res.status == 200) {
        this.head = [];
        // console.log(res);
        // 渲染表格
        // 需要数据格式如下
        // [{id: name: 实验A: 实验B: }
        this.current_table = res.data;
        // 形成表头
        for (let key in res.data[0]) {
          this.head.push(key);
        }
        this.out_class = this.current_class;
      } else {
        this.$message.error('服务器错误!请稍后再试');
      }
    }
  },
  async created() {
    // 获得班级
    const { data: res } = await this.$http.post('getClass', {
      id: this.id
    });
    if (res.status == 202) {
      this.$message.error('登录状态已失效!请先登录');
      // 重定向到登录页
      this.$router.push('/login');
    } else if (res.status == 200) {
      // console.log(res);

      for (let i = 0; i < res.data.length; i++) {
        this.classOption.push({
          value: res.data[i].class_id,
          label: res.data[i].class_id
        });
      }
    } else {
      this.$message.error('服务器错误,请稍后再试');
    }
  }
};
</script>
<style scoped>
.el-button {
  margin-left: 10px;
}
</style>
