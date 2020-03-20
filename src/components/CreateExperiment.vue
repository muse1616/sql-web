<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>教师页</el-breadcrumb-item>
      <el-breadcrumb-item
        ><span style="font-weight:bolder">创建实验</span></el-breadcrumb-item
      >
    </el-breadcrumb>

    <el-row :gutter="5">
      <el-col :span="2">
        <div class="stepDiv">
          <el-button
            class="stepBtn"
            plain
            icon="el-icon-arrow-left"
            @click="step--"
            :disabled="step == 1"
            style="border:none;margin:auto;vertical-align:middle"
          ></el-button>
        </div>
      </el-col>
      

      <el-col :span="21">
        <el-card
          class="box-card"
          shadow="hover"
          style="border:none;min-height:300px"
        >
          <!-- 步骤1 -->
          <div v-if="step == 1">
            <el-form
              :model="form_step1"
              :rules="rule_step1"
              ref="ref_step1"
              label-width="100px"
              style="margin-left:20px"
            >
              <el-form-item label="实验名称" prop="name">
                <el-input v-model="form_step1.name"></el-input>
              </el-form-item>
              <el-form-item label="实验目的" prop="aim">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="form_step1.aim"
                  resize="none"
                ></el-input>
              </el-form-item>
              <el-form-item label="实验描述" prop="desc">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="form_step1.desc"
                  resize="none"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 步骤2 -->
          <div v-if="step == 2" style="margin-left:40px">
            <el-transfer
              v-model="value"
              :data="data"
              :titles="['我的数据库', '关联表']"
            ></el-transfer>
          </div>
          <!-- 步骤3 -->

          <div v-if="step == 3" style="margin-left:120px;margin-top:90px">
            <span>日期选择:</span>
            <el-date-picker
              v-model="dateArr"
              type="daterange"
              range-separator="至"
              start-placeholder="可见日期"
              end-placeholder="截止日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
          <!-- 步骤4 -->
          <div v-if="step == 4" style="min-height:200px">
            <!-- 题目答案 -->
            <el-button @click="drawer = true" type="text">
              点击打开sql语句测试面板
            </el-button>
            <el-alert
              title="运行SQL使用临时库表,不会影响原表"
              type="info"
              show-icon
            >
            </el-alert>
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
              <div
                v-if="sql_type == 1"
                style="margin-left:40px;margin-top:30px"
              >
                运行结果:
                <span>{{ sql_result }}</span>
              </div>

              <!-- 结果区域 -->
              <div
                v-else-if="sql_type == 2"
                style="margin-left:40px;margin-top:30px"
              >
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
                    v-for="(item, index) in fieldArr"
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

            <el-divider></el-divider>
            <div>
              <span>题目数目:</span>
              <el-input-number
                v-model="p_count"
                :step="1"
                :min="1"
                step-strictly
                style="margin-left:10px"
              ></el-input-number>
            </div>

            <el-collapse style="margin-top:10px">
              <el-collapse-item
                :title="`题目:${index + 1}`"
                v-for="(i, index) in p_count"
                :key="index"
              >
                <el-form :model="group[index]" label-width="80px">
                  <el-form-item label="题目">
                    <el-input v-model="group[index].problem"></el-input>
                  </el-form-item>

                  <el-form-item label="答案">
                    <el-input v-model="group[index].answer">
                      <el-tooltip
                        slot="append"
                        class="item"
                        effect="dark"
                        content="提示：如果此题有多个答案，请以“$$$”符号进行分隔。"
                        placement="right"
                        style="float:left"
                      >
                        <i class="el-icon-plus"></i>
                      </el-tooltip>
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>

      <el-col :span="1">
        <div class="stepDiv">
          <el-button
            class="stepBtn"
            plain
            @click="step++"
            :disabled="step == 4"
            style="border:none"
            ><i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </div>
      </el-col>
    </el-row>

    <!-- <el-button-group>
    
    </el-button-group> -->
    <el-button
      type="primary"
      @click="createExperiment"
      id="cBtn"
      v-if="step == 4"
      >创建<i class="el-icon-upload el-icon--right"></i
    ></el-button>
    <el-steps :active="step" align-center style="margin-top:30px">
      <el-step
        title="步骤1"
        description="填写实验名称、实验目的(可选)、实验描述(可选)"
      ></el-step>
      <el-step title="步骤2" description="选择关联库表"></el-step>
      <el-step title="步骤3" description="选择可见日期、截止日期"></el-step>
      <el-step title="步骤4" description="填写题目及答案"></el-step>
    </el-steps>
  </div>
</template>

<script>
import format from '../utils/date';
export default {
  data() {
    return {
      id: window.localStorage.getItem('user_id'),
      drawer: false,
      data: [],
      value: [],
      step: 1,
      form_step1: {
        name: '',
        aim: '',
        desc: ''
      },
      p_count: 1,
      sql_result: '',
      sql_table: '',
      sql_type: '',
      sql_test: '',
      dateArr: '',
      rule_step1: {
        name: [{ required: true, message: '请输入实验名称', trigger: 'blur' }],
        aim: [{ max: 200, message: '长度不能超过200个字符', trigger: 'blur' }],
        desc: [{ max: 200, message: '长度不能超过200个字符', trigger: 'blur' }]
      },
      fieldArr: [],
      group: [
        {
          problem: '',
          answer: ''
        }
      ]
    };
  },
  computed: {},
  watch: {
    p_count(val) {
      if (this.group.length < this.p_count) {
        this.group.push({
          problem: '',
          answer: ''
        });
      }
      if (this.group.length > this.p_count) {
        this.group.pop();
      }
    }
  },
  methods: {
    createExperiment() {
      if (this.form_step1.name == '') {
        this.$message({
          type: 'warning',
          message: '请填写实验名称'
        });
        this.step = 1;
        return;
      }
      if (this.value.length == 0) {
        this.$message({
          type: 'warning',
          message: '至少有一张关联表'
        });
        this.step = 2;
        return;
      }
      // 日期检测
      if (this.dateArr.length == 0) {
        this.$message({
          type: 'warning',
          message: '日期未指定'
        });
        this.step = 3;
        return;
      }
      if (this.dateArr[1] < new Date().format('yyyy-MM-dd')) {
        this.$message({
          type: 'warning',
          message: '截止日期不能早于当前日期'
        });
        this.step = 3;
        return;
      }
      // 检测题目
      for (let i = 0; i < this.group.length; i++) {
        if (this.group[i].problem == '' || this.group[i].answer == '') {
          this.$message({
            type: 'warning',
            message: '题目:' + (i + 1) + ' 信息未填写完整'
          });
          this.step = 4;
          return;
        }
      }

     

      let confirmMsg = `
      是否创建实验?
      实验名称:${this.form_step1.name}
      ;实验目的:${this.form_step1.aim != '' ? this.form_step1.aim : '无'}
      ;实验描述:${this.form_step1.desc != '' ? this.form_step1.desc : '无'}
      ;关联库表:${this.value.toString()}
      ;可见日期:${this.dateArr[0]}
      ;截止日期:${this.dateArr[1]}
      ;题目数量:${this.group.length}
      `;
      this.$confirm(confirmMsg, '提示', {
        confirmButtonText: '确定创建',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 封装对象
          let Experiment = {
            name: this.form_step1.name,
            aim: this.form_step1.aim,
            desc: this.form_step1.desc,
            tables: this.value,
            reachTime: this.dateArr[0],
            deadline: this.dateArr[1],
            group: this.group
          };
          const { data: res } = await this.$http.post('experiment/create', {
            id: this.id,
            experiment: Experiment
          });
          // 渲染结果
          if (res.status == 202) {
            this.$message.error('登录状态已失效!请先登录');
            // 重定向到登录页
            this.$router.push('/login');
          } else if (res.status == 200) {
            this.$message.success('创建成功');

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
    },
    async runSql() {
      if (this.sql_test == '') {
        return this.$message({
          type: 'warning',
          message: '语句不能为空'
        });
      }

      const { data: res } = await this.$http.post('runSql', {
        id: this.id,
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
          this.fieldArr = [];
          this.sql_table = [];
          // 遍历field
          for (let key of res.data.msg.fields) {
            // 存放
            this.fieldArr.push(key);
          }
          for (let i = 0; i < res.data.msg.rows.length; i++) {
            // 切割字符串
            let rowArr = res.data.msg.rows[i].split('$$$');
            // 最后一项不要
            rowArr.pop();
            // 每一行的对象 key:value
            let rowObj = {};
            for (let j = 0; j < rowArr.length; j++) {
              rowObj[this.fieldArr[j]] = rowArr[j];
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
      const { data: isSuccess } = await this.$http.post('createTmpTable', {
        id: this.id
      });
      if (isSuccess.status == 202) {
        this.$message.error('登录状态已失效!请先登录');
        // 重定向到登录页
        this.$router.push('/login');
      } else if (isSuccess.status == 200) {
        this.$message.success('临时数据库刷新成功');
      } else {
        this.$message.error('临时数据库刷新错误');
      }
    }
  },
  async created() {
    // 获取表库
    const { data: res } = await this.$http.post('getTable', { id: this.id });
    if (res.status == 202) {
      this.$message.error('登录状态已失效!请先登录');
      // 重定向到登录页
      this.$router.push('/login');
    } else if (res.status == 200) {
      // let tables = res.data;
      // console.log(res.data);
      for (let i = 0; i < res.data.length; i++) {
        let obj = {
          key: res.data[i],
          label: res.data[i]
        };
        this.data.push(obj);
      }
    }

    // 创建临时库表
    const { data: isSuccess } = await this.$http.post('createTmpTable', {
      id: this.id
    });
    if (isSuccess.status == 202) {
      this.$message.error('登录状态已失效!请先登录');
      // 重定向到登录页
      this.$router.push('/login');
    } else if (isSuccess.status == 200) {
      this.$message.success('临时数据库加载成功');
    } else {
      this.$message.error('临时数据库加载未知错误');
    }
  }
};
</script>
<style scoped>
.stepDiv {
  margin-top: 130px;
}
.el-form-item {
  width: 70%;
}
#cBtn {
  display: block;
  margin: 0 auto;
  margin-top: 10px;
}
</style>
