import Vue from 'vue'

// 按需导入组件
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    Select,
    Option,
    Scrollbar,
    Tag,
    Alert,
    Collapse,
    CollapseItem,
    Divider,
    Upload,
    Confirm,
    MessageBox,
    Tabs,
    TabPane,
    Step,
    Steps,
    ButtonGroup,
    Transfer,
    DatePicker,
    Drawer,
    InputNumber,
    Progress
} from 'element-ui'


// 注册为全局组件
Vue.use(Select)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Option)
Vue.use(Scrollbar)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Divider)
Vue.use(Upload)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Step)
Vue.use(Steps)
Vue.use(ButtonGroup)
Vue.use(Transfer)
Vue.use(DatePicker)
Vue.use(Drawer)
Vue.use(InputNumber)
Vue.use(Progress)

// 消息弹窗需要全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt