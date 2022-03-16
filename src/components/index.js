// 负责全局自定组件的注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel' // 表格的组件
import ImageUpload from './ImageUpload' // 头像上传的组件
import Print from 'vue-print-nb' // 引入打印插件

export default {
  install(Vue) {
    Vue.component('PageTools', PageTools) // 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.use(Print) // 注册打印插件
  }
}
