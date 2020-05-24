<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教师页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><span style="font-weight:bolder">实验管理</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    选择实验:
    <el-select v-model="current_experiment" placeholder="" :disabled="ifEdit">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-button
      title="编辑该实验"
      :disabled="ifEdit"
      @click="editModel"
      style="margin-left:10px"
      type="primary"
      icon="el-icon-edit"
      circle
    ></el-button>
    <el-button
      title="取消编辑"
      @click="quitEditModel"
      style="margin-left:10px"
      type="danger"
      icon="el-icon-close"
      circle
      v-if="ifEdit == true"
    ></el-button>

    <el-button
      title="确认修改"
      style="margin-left:10px"
      type="success"
      icon="el-icon-check"
      circle
      @click="edit"
      v-if="ifEdit == true"
    ></el-button>

    <el-divider></el-divider>

    <el-form :model="experiment" label-width="100px">
      <el-form-item label="实验名称">
        <el-input v-model="experiment.name" disabled> </el-input>
      </el-form-item>
      <el-form-item label="实验目的">
        <el-input v-model="experiment.aim" :disabled="!ifEdit"> </el-input>
      </el-form-item>
      <el-form-item label="实验描述">
        <el-input v-model="experiment.describe" :disabled="!ifEdit"> </el-input>
      </el-form-item>

      <el-form-item label="关联库表">
        <el-input v-model="experiment.exp_table" disabled> </el-input>
      </el-form-item>

      <el-form-item label="实验日期">
        <el-date-picker
          v-model="dateArr"
          type="daterange"
          range-separator="至"
          start-placeholder="可见日期"
          end-placeholder="截止日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          :disabled="!ifEdit"
        >
        </el-date-picker
      ></el-form-item>
      <div v-for="(item, index) in experiment.group" :key="index">
        <el-form-item :label="`第${index + 1}题题目`">
          <el-input
            v-model="experiment.group[index].problem"
            :disabled="!ifEdit"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="`第${index + 1}题答案`">
          <el-input
            v-model="experiment.group[index].answer"
            :disabled="!ifEdit"
          >
          </el-input>
        </el-form-item>
          <el-form-item :label="`第${index + 1}题分值`">
              <el-input
                      v-model="experiment.group[index].score"
                      :disabled="!ifEdit"
              >
              </el-input>
          </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: window.localStorage.getItem('user_id'),
      options: [],
      current_experiment: '',
      record: null,
      experiment: {},
      dateArr: [],
      activeNames: ['1'],
      ifEdit: false,
      tempCopy: ''
    };
  },
  methods: {
    editModel() {
      if (this.ifEdit == false) {
        this.ifEdit = !this.ifEdit;
        // 生成一个备份
        this.tempCopy = JSON.parse(JSON.stringify(this.experiment));
      }
    },
    quitEditModel() {
      this.ifEdit = false;
      this.dateArr = [];
      this.dateArr.push(this.tempCopy.reachTime);
      this.dateArr.push(this.tempCopy.deadline);
      // 还原
      this.experiment = JSON.parse(JSON.stringify(this.tempCopy));
    },
    edit() {
      this.$confirm('确认修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.experiment.reachTime = this.dateArr[0];
          this.experiment.deadline = this.dateArr[1];

          // 请求
          const { data: res } = await this.$http.post('experiment/edit', {
            teacher_id: this.id,
            name: this.current_experiment,
            experiment: this.experiment
          });

          if (res.status == 202) {
            this.$message.error('登录状态已失效!请先登录');
            // 重定向到登录页
            this.$router.push('/login');
          } else if (res.status == 200) {
            this.$message.success('修改成功');

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            this.$message.error('服务器错误,请稍后再试');
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消创建'
          });
        });
    }
  },
  watch: {
    current_experiment(val) {
      this.dateArr = [];
      for (let i = 0; i < this.record.length; i++) {
        if (this.record[i].name == this.current_experiment) {
          // 不能用等号赋
          this.experiment = JSON.parse(JSON.stringify(this.record[i]));
          this.tempCopy = JSON.parse(JSON.stringify(this.record[i]));
          this.dateArr.push(this.experiment.reachTime);
          this.dateArr.push(this.experiment.deadline);
          return;
        }
      }
    }
  },
  async created() {
    // 获取所有实验信息
    const { data: res } = await this.$http.post('experiment/getAll', {
      id: this.id
    });
    if (res.status == 202) {
      this.$message.error('登录状态已失效!请先登录');
      // 重定向到登录页
      this.$router.push('/login');
    } else if (res.status == 200) {
      // 渲染选择器
      for (let i = 0; i < res.data.length; i++) {
        this.options.push({
          label: res.data[i].name,
          value: res.data[i].name
        });
      }
      // 记录备份 record不能被变化
      this.record = res.data;

      // 设置默认值

      this.current_experiment = this.options[0].value;

      this.experiment = res.data[0];
    } else {
      this.$message.error('读取实验列表错误,请稍后再试');
    }
  }
};
</script>
<style scoped>
.el-input {
  width: 600px;
}
</style>
