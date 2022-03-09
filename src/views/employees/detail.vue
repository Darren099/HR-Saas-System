<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置登录账户表单 -->
            <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="用户名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="个人详情">
            <!-- <UserInfo /> -->
            <!-- 使用动态组件  可以切换组件 -->
            <component :is="UserComponent" />
          </el-tab-pane>

          <el-tab-pane label="岗位信息">
            <component :is="JobComponent" />
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user.js'
import { saveUserDetailById } from '@/api/employees.js'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'

export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      UserComponent: 'UserInfo',
      JobComponent: 'JobInfo',
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据
      userInfo: {
        username: '',
        password2: '' // 因为读取出来的密码是密文
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    saveUser() {
      this.$refs.userForm.validate().then(async() => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message('修改用户信息成功')
      })
    }
  }
}
</script>

<style>

</style>
