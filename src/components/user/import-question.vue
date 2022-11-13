<template>
  <el-dialog width="400px" title="导入数据" :close-on-click-modal="false" :visible.sync="visible" @closed="cancelUpload()">
    <el-upload ref="upload"
               action=""
               :http-request="uploadFile"
               :file-list="fileList"
               :on-change="judgeFileType"
               :auto-upload="false"
               :on-exceed="handleExceed"
               :multiple="false"
               :limit="1"
               accept=".xlsx, .xls">
      <el-button slot="trigger" type="primary">
        <i class="el-icon-document-add"></i>选取文件
      </el-button>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelUpload">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submitUpload">上传<i class="el-icon-upload2"></i></el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { success, warning } from '@/utils/message'
import { apiDefaultErrorHandler } from '@/api/base'
import questionsApi from '@/api/exam/questions'


export default {
  name: 'import-question.vue',
  data () {
    return {
      loading: false,
      visible: false,
      fileList: [],
    }
  },
  methods: {
    handleExceed (files, fileList) {
      // warning('无法添加更多文件')
    },
    /**
     * 判断文件类型
     */
    judgeFileType (file) {
      let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (suffix !== 'xlsx' && suffix !== 'xls') {
        // warning('请选择正确的文件格式的文件')
        this.fileList.splice(0, 1)
      }
    },
    /**
     * 上传文件
     */
    async uploadFile(param) {
        console.log(param)
      let fileObject = param.file
      let formData = new FormData()
      formData.append('file', fileObject)
      const {data: res} = await this.$http.post('sysUser/import-data', this.formData)

    },
    cancelUpload() {
      this.fileList.splice(0,1)
      this.visible = false
    },
    /**
     * 点击上传
     */
    submitUpload() {
      if (this.$refs.upload.uploadFiles.length === 1) {
        this.$refs.upload.submit()
      }else{
        // warning('请选取文件')
      }
    },
    init() {
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
