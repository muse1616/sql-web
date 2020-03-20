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
    path: '/teacher/home',
    name: '/teacher/home',
    redirect:'/teacher/home/experiment/create',
    component: TeacherHome,
    // 子路由
    children:[{
      path:'experiment/create',
      component:CreateExperiment
    },
    {
      path:'database/management',
      component:DatabaseManagement
    },
    {
      path:'experiment/management',
      component:ExperimentManagement
    },
    {
      path:'class/management',
      component:ClassManagement
    },
    {
      path:'grade',
      component:GradeManagement
    },
    {
      path:'profile',
      component:TeacherProfile
    },
    {
      path:'help',
      component:Help
    },
  
  
  
  ]
  }
]

const router = new VueRouter({
  routes
})

export default router