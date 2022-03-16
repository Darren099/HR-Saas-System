<template>
  <div>
    <!-- action是必填的上传地址属性，先填#以防报错 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{ disabled:fileComputed }"
    >
      <!-- 如果fileComputed为true那么el-upload就有一个名称为disabled的class -->
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云的包
// 需要实例化
const cos = new COS({
  SecretId: 'AKIDPeePvCDyUmocCWbQIwKSKwJQHsDI7fx0',
  SecretKey: 'rSpyrUr8KK4ZonWzGI4aqrc7NN7dtsb4'
}) // 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了

export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: '', // 用一个变量 记住当前上传的图片id
      percent: 0, // 当前的百分比
      showPercent: false, // 默认不显示进度条
      // 进度条
      onProgress: (params) => {
        this.percent = params.percent * 100
      }
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
    // file是点击删除的文件 filelist里的id和file里的id是一样的，
    // 函数里的fileList是空的，还可以this,fileList=fileList
    // 将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 修改文件时触发
    // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
    // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
    // [] => [...fileList] [] => fileList.map()
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小 进制转换m变成B
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // file.uid 确定准备上传文件
      this.currentFileUid = file.uid // 记住当前的uid
      this.showPercent = true
      return true
    },
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    upload(params) {
      if (params.file) {
        //  上传文件到腾讯云
        cos.putObject({
          // 配置
          Bucket: 'huracan-1310045506', // 存储桶名称
          Region: 'ap-beijing', // 存储桶地域
          Key: params.file.name, // 文件名作为key
          StorageClass: 'STANDARD', // 此类写死
          Body: params.file, // 将本地的文件赋值给腾讯云配置
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // 需要判断错误与成功
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 如果没有失败表示成功了
            // 此时认为上传成功了
            // this.currentFileUid
            // 仍然有个小问题， 比如此时我们正在上传，但是调用了保存，保存在上传过程中进行，
            // 此时上传还没有完成  此时可以这样做 ： 给所有上传成功的图片 加一个属性 upload: true
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                //   upload为true表示 该图片已经成功上传到服务器，地址已经是腾讯云的地址了  就不可以执行保存了
                return { url: 'http://' + data.Location, upload: true } // 将本地的地址换成腾讯云地址
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 2000)

            // 将腾讯云地址写入到fileList上 ，保存的时候 就可以从fileList中直接获取图片地址

            // 此时注意，我们应该记住 当前上传的是哪个图片  上传成功之后，将图片的地址赋值回去
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
