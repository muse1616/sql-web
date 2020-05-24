import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)
// 路由懒加载
const Login = () => import('../components/Login.vue')
const TeacherHome = () => import('../components/TeacherHome.vue')
const CreateExperiment = () => import('../components/CreateExperiment.vue')
const ClassManagement = () => import('../components/ClassManagement.vue')
const DatabaseManagement = () => import('../components/DatabaseManagement.vue')
const GradeManagement = () => import('../components/GradeManagement.vue')
const Help = () => import('../components/help.vue')
const TeacherProfile = () => import('../components/TeacherProfile.vue')
const ExperimentManagement = () => import('../components/ExperimentManagement.vue')
const StudentHome = () => import('../components/StudentHome.vue')
const StudentProfile = () => import('../components/StudentProfile.vue')
const TestHistory = () => import('../components/TestHistory.vue')
const TestInfo = () => import('../components/TestInfo.vue')
const Test = () => import('../components/Test.vue')
const Root = () => import('../components/Root.vue')
const routes = [
  // 默认重定向
  {
    path: '',
    redirect: 'login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path:'/root',
    component:Root
  },
  {
    path: '/teacher/home',
    name: '/teacher/home',
    redirect: '/teacher/home/experiment/create',
    component: TeacherHome,
    // 子路由
    children: [{
        path: 'experiment/create',
        component: CreateExperiment
      },
      {
        path: 'database/management',
        component: DatabaseManagement
      },
      {
        path: 'experiment/management',
        component: ExperimentManagement
      },
      {
        path: 'class/management',
        component: ClassManagement
      },
      {
        path: 'grade',
        component: GradeManagement
      },
      {
        path: 'profile',
        component: TeacherProfile
      },
      {
        path: 'help',
        component: Help
      },
    ]
  },
  {
    path: '/student/home/',
    name: '/student/home',
    component: StudentHome,
    children: [{
        path: 'profile',
        component: StudentProfile
      }, {
        path: 'help',
        component: Help
      }, {
        path: 'test/history',
        component: TestHistory
      },
      {
        path: 'test/get/:test_id',
        component: ()=>import('@/components/TestInfo.vue')
      },
      {
        path: 'test/start/:test_name',
        component: Test
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
