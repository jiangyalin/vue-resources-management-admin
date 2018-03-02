<template>
  <div v-loading="loading">
    <div class="m-menu" v-if="propertyInfo.numbering !== ''">
      <el-badge>房源编号: {{propertyInfo.numbering}}</el-badge>
      <el-badge style="margin-left: 10px">房源名称: {{propertyInfo.name}}</el-badge>
    </div>
    <el-upload
      drag
      :headers="headers"
      :action="action"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :file-list="fileList"
      :multiple="true"
      :on-success="handleAvatarSuccess"
      :on-error="handleError"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog
      :visible.sync="dialogVisible">
      <img
        width="100%"
        :src="dialogImageUrl"
        alt="">
    </el-dialog>
    <div class="u-btn-gp">
      <el-button type="primary" @click="submitForm" size="mini">保存</el-button>
      <el-button @click="cancelForm" size="mini">返回</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 获取图片列表
  const GetImagesList = (vue) => {
    const imagesList = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/pictures',
        params: {},
        headers: {
          'languageCode': vue.$route.params.lang,
          'Authorization': 'Bearer ' + vue.$cookie.get('token')
        }
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
    return imagesList
  }
  // 获取图片信息
  const GetImagesInfo = (vue, code) => {
    const imgInfo = new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.serverFile + '/api/v1/files/' + code,
        params: {},
        headers: {
          'languageCode': vue.$route.params.lang,
          'Authorization': 'Bearer ' + vue.$cookie.get('token')
        }
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
    return imgInfo
  }
  // 变更图片
  const SetImages = (vue, list) => {
    const images = new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/v1/rooms/' + vue.$route.params.propertyId + '/pictures',
        data: {
          pictures: list
        },
        headers: {
          'languageCode': vue.$route.params.lang,
          'Authorization': 'Bearer ' + vue.$cookie.get('token')
        }
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
    return images
  }
  export default {
    data () {
      return {
        fileList: [],
        images: [],
        headers: {
          'languageCode': this.$route.params.lang,
          'Authorization': 'Bearer ' + this.$cookie.get('token')
        },
        action: window.config.serverFile + '/api/v1/files',
        dialogImageUrl: '',
        dialogVisible: false,
        loading: true
      }
    },
    props: ['propertyInfo'],
    methods: {
      // 取消
      cancelForm () {
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyInfo/' + this.$route.params.propertyId)
      },
      // 上传成功
      handleAvatarSuccess (res, file, fileList) {
        this.images.push(file.response)
      },
      // 上传失败
      handleError (err, file, fileList) {
        this.$message.error('网络错误')
        console.log(err)
      },
      // 删除文件
      handleRemove (file, fileList) {
        let index = this.images.indexOf(file.response)
        if (index === -1) {
          index = this.images.indexOf(file)
        }
        this.images.splice(index, 1)
      },
      // 上传
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 提交
      submitForm () {
        const data = this.images.map((data, index) => {
          return {
            pictureUrl: data.code,
            sort: (index + 1)
          }
        })
        // 变更图片
        const Images = SetImages(this, data)

        Images.then((resolve) => {
          if (resolve.data.code === '200') {
            this.$confirm('保存图片信息成功', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'success'
            }).then(() => {
              this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyList/propertyInfo/' + this.$route.params.propertyId)
            })
          }
        }).catch((reject) => {
          window.publicFunction.error(reject, this)
        })
      },
      resetForm () {
        this.$router.push('/' + this.$route.params.lang + '/operateCenter/property/propertyInfo/' + this.$route.params.propertyId)
      }
    },
    created: function () {
      // 获取图片列表
      const ImagesList = GetImagesList(this)

      ImagesList.then((resolve) => {
        const imgs = resolve.data.data.map((data) => {
          return {
            id: data.id,
            code: data.pictureUrl
          }
        })

        imgs.forEach((data) => {
          // 获取图片信息
          const ImgInfo = GetImagesInfo(this, data.code)

          ImgInfo.then((resolve) => {
            const Img = {
              id: resolve.data.id,
              url: resolve.data.url,
              code: resolve.data.code
            }
            this.fileList.push(Img)
            this.images.push(Img)
          }).catch((reject) => {
            window.publicFunction.error(reject, this)
          })
        })
        this.loading = false
      }).catch((reject) => {
        window.publicFunction.error(reject, this)
      })
    }
  }
</script>

<style scoped>
  .u-btn-gp{
    padding-top: 10px;
  }
</style>

<style>
  .g-main .el-upload-dragger{
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>
