// 负责全局自定组件的注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel' // 表格的组件
import ImageUpload from './ImageUpload' // 头像上传的组件
import Print from 'vue-print-nb' // 引入打印插件
import ScreenFull from './ScreenFull' // 全局引入全屏插件
import ThemePicker from './ThemePicker' // 修改基础主题颜色插件
import LangSelect from './lang' // 引入切换语言的插件
import TagsView from './TagsView' // 引入多页签插件

export default {
  install(Vue) {
    Vue.component('PageTools', PageTools) // 注册工具栏组件
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.use(Print) // 注册打印插件
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('LangSelect', LangSelect)
    Vue.component('TagsView', TagsView)
  }
}
