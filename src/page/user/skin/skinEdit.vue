<template>
  <div class="m-odr" v-loading="loading">
    <transition name="el-fade-in-linear">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini" class="demo-ruleForm">
        <el-form-item class="s-wh-fl" label="用户" prop="user">
          <el-select style="width: 100%;" v-model="ruleForm.user" filterable>
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="a背景色" prop="type_a_backgroundColor">
          <el-color-picker v-model="ruleForm.type_a_backgroundColor" show-alpha size="small"></el-color-picker>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="a阴影size" prop="type_a_boxShadow_size">
          <el-input v-model="ruleForm.type_a_boxShadow_size"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="a阴影色" prop="type_a_boxShadow_color">
          <el-color-picker v-model="ruleForm.type_a_boxShadow_color" show-alpha size="small"></el-color-picker>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="a背景图" prop="type_a_backgroundImage">
          <el-button @click="uploadBtn(0)">{{type_a_backgroundImage_btn}}</el-button>
          <el-input style="display: none" v-model="ruleForm.type_a_backgroundImage"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="a图大小" prop="type_a_backgroundSize">
          <el-input-number class="s-wd-100" v-model="ruleForm.type_a_backgroundSize" :min="0" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="网页背景" prop="backgroundImage">
          <el-button @click="uploadBtn(1)">{{backgroundImage_btn}}</el-button>
          <el-input style="display: none" v-model="ruleForm.backgroundImage"></el-input>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="b透明度" prop="type_b_opacity">
          <el-input-number class="s-wd-100" v-model="ruleForm.type_b_opacity" :min="0" :max="1"></el-input-number>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="b背景色" prop="type_b_backgroundColor">
          <el-color-picker v-model="ruleForm.type_b_backgroundColor" show-alpha size="small"></el-color-picker>
        </el-form-item>
        <el-form-item class="s-wh-fl" label="b字体色" prop="type_b_fontColor">
          <el-color-picker v-model="ruleForm.type_b_fontColor" show-alpha size="small"></el-color-picker>
        </el-form-item>
        <el-form-item style="width: 100%;float: left;">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </transition>
    <el-dialog title="上传图片" :visible.sync="dialogFormVisible">
      <el-upload
        class="upload-demo"
        :headers="upload.headers"
        :action="upload.action"
        :on-preview="handlePictureCardPreview"
        :file-list="upload.fileList"
        :multiple="upload.true"
        :on-success="handleAvatarSuccess"
        :on-error="handleError"
        :limit="upload.limit"
        :on-remove="handleRemove">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传png,jpg,jpeg,gif文件，且不超过50M</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="uploadDetermineBtn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import CanvasAvatar from './../../../components/public/canvas-avatar/index.vue'
  // 编辑皮肤
  const EditSkin = (vue, data) => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'post',
        url: window.config.server + '/api/user/skin/' + vue.ruleForm.id,
        data,
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
  }
  // 获取全部用户
  const GetUserAll = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/user/user',
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
  }
  // 获取皮肤详情
  const GetSkin = vue => {
    return new Promise((resolve, reject) => {
      vue.$http({
        method: 'get',
        url: window.config.server + '/api/user/skin/' + vue.$route.params.userId,
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
  }
  // rgba 转 数组
  const RgbaToArr = rgba => {
    let arr = []
    rgba = rgba.substring(rgba.indexOf('(') + 1)
    arr.push(Number(rgba.substring(0, rgba.indexOf(','))))
    rgba = rgba.substring(rgba.indexOf(',') + 1)
    arr.push(Number(rgba.substring(0, rgba.indexOf(','))))
    rgba = rgba.substring(rgba.indexOf(',') + 1)
    arr.push(Number(rgba.substring(0, rgba.indexOf(','))))
    rgba = rgba.substring(rgba.indexOf(',') + 1)
    arr.push(Number(rgba.substring(0, rgba.indexOf(')'))))
    return arr
  }
  export default {
    name: 'userAdd',
    data () {
      return {
        ruleForm: {
          id: '',
          user: '', // 用户
          type_a_backgroundColor: 'rgba(0, 0, 0, 0)', // 类型a盒子背景颜色raba
          type_a_boxShadow_size: '', // 类型a盒子阴影大小
          type_a_boxShadow_color: 'rgba(0, 0, 0, 0)', // 类型a盒子阴影颜色
          type_a_backgroundImage: '', // 类型a盒子背景图片
          type_a_backgroundSize: '', // 类型a盒子背景图片大小
          backgroundImage: '', // 网页背景图片
          type_b_opacity: '', // 类型b盒子背景透明度
          type_b_backgroundColor: 'rgba(0, 0, 0, 0)', // 类型b盒子背景颜色raba
          type_b_fontColor: 'rgba(0, 0, 0, 0)' // 类型b盒子字体颜色rgba
        },
        uploadClickBtnType: 0,
        type_a_backgroundImage_btn: '点击上传a盒子背景图片',
        backgroundImage_btn: '点击上传网页背景图片',
        rules: {
          user: [
            { required: true, message: '请选择用户', trigger: 'blur' }
          ],
          type_a_backgroundColor: [
            { required: true, message: '请选择a盒子背景颜色', trigger: 'blur' }
          ],
          type_a_boxShadow_size: [
            { required: true, message: '填写a盒子阴影大小如0，0，0，0', trigger: 'blur' }
          ],
          type_a_boxShadow_color: [
            { required: true, message: '请选择a盒子阴影颜色', trigger: 'blur' }
          ],
          type_a_backgroundImage: [
            { required: true, message: '请选择a盒子背景图片', trigger: 'blur' }
          ],
          backgroundImage: [
            { required: true, message: '请选择网页背景图片', trigger: 'blur' }
          ],
          type_a_backgroundSize: [
            { required: true, message: '请输入a背景图片大小', trigger: 'blur' }
          ],
          type_b_opacity: [
            { required: true, message: '请输入b盒子背景透明度', trigger: 'blur' }
          ],
          type_b_backgroundColor: [
            { required: true, message: '请输入b盒子背景颜色', trigger: 'blur' }
          ],
          type_b_fontColor: [
            { required: true, message: '请输入b盒子字体颜色', trigger: 'blur' }
          ]
        },
        upload: {
          fileList: [],
          images: [],
          headers: {
            'languageCode': this.$route.params.lang,
            'Authorization': 'Bearer ' + this.$cookie.get('token')
          },
          action: window.config.upload + '/api/upload',
          dialogImageUrl: '',
          dialogVisible: false,
          limit: 1
        },
        dialogFormVisible: false,
        userOptions: [],
        loading: false
      }
    },
    components: {
      canvasAvatar: CanvasAvatar
    },
    methods: {
      // 上传成功
      handleAvatarSuccess (res, file, fileList) {
        this.upload.fileList = fileList
      },
      // 上传失败
      handleError (err, file, fileList) {
        if (err) this.$message.error('上传失败')
      },
      // 删除文件
      handleRemove (file, fileList) {
        this.$message.info('删除成功')
      },
      // 上传
      handlePictureCardPreview (file) {
        this.dialogVisible = true
      },
      // 点击上传图片按钮
      uploadBtn (type) {
        this.upload.fileList = []
        this.dialogFormVisible = true
        this.uploadClickBtnType = type
      },
      // 点击上传图片确定按钮
      uploadDetermineBtn () {
        this.dialogFormVisible = false
        if (this.uploadClickBtnType === 0) {
          this.ruleForm.type_a_backgroundImage = this.upload.fileList[0].response.data.id
          this.type_a_backgroundImage_btn = this.upload.fileList[0].response.data.id
        } else if (this.uploadClickBtnType === 1) {
          this.ruleForm.backgroundImage = this.upload.fileList[0].response.data.id
          this.backgroundImage_btn = this.upload.fileList[0].response.data.id
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let boxShadow = this.ruleForm.type_a_boxShadow_size.split(',')
            boxShadow.push(RgbaToArr(this.ruleForm.type_a_boxShadow_color))
            const skin = {
              user: this.ruleForm.user, // 用户
              type_a_backgroundColor: RgbaToArr(this.ruleForm.type_a_backgroundColor), // 类型a盒子背景颜色raba
              type_a_boxShadow: boxShadow, // 类型a盒子阴影 左位移，上位移，扩展，大小，rgba [0, 1, 0, 2, [0, 0, 0, 0.1]]
              type_a_backgroundImage: this.ruleForm.type_a_backgroundImage, // 类型a盒子背景图片
              type_a_backgroundSize: this.ruleForm.type_a_backgroundSize, // 类型a盒子背景图片大小
              backgroundImage: this.ruleForm.backgroundImage, // 网页背景图片
              type_b_opacity: this.ruleForm.type_b_opacity, // 类型b盒子背景透明度
              type_b_backgroundColor: RgbaToArr(this.ruleForm.type_b_backgroundColor), // 类型b盒子背景颜色raba
              type_b_fontColor: RgbaToArr(this.ruleForm.type_b_fontColor)// 类型b盒子字体颜色rgba
            }
            EditSkin(this, skin).then((resolve) => {
              if (resolve.data.code === '200') {
                this.$confirm('编辑皮肤成功', '提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  type: 'success'
                }).then(() => {
                  this.$router.push('/' + this.$route.params.lang + '/user/user/userList')
                })
              }
            }).catch((reject) => {
              window.publicFunction.error(reject, this)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      getCoverBase (msg) {
        this.coverBase = msg
      },
      init () {
        // 获取所有用户
        GetUserAll(this).then(resolve => {
          this.userOptions = resolve.data.data.content.map(data => {
            return {
              value: data._id,
              label: data.nickname,
              name: data.name
            }
          })
        }).catch(reject => {
          window.publicFunction.error(reject, this)
        })

        GetSkin(this).then(resolve => {
          this.ruleForm = {
            id: resolve.data.data._id,
            user: resolve.data.data.user, // 用户
            type_a_backgroundColor: 'rgba(' + resolve.data.data.type_a_backgroundColor.join(',') + ')', // 类型a盒子背景颜色raba
            type_a_boxShadow_size: resolve.data.data.type_a_boxShadow[0] + ',' + resolve.data.data.type_a_boxShadow[1] + ',' + resolve.data.data.type_a_boxShadow[2] + ',' + resolve.data.data.type_a_boxShadow[3], // 类型a盒子阴影大小
            type_a_boxShadow_color: 'rgba(' + resolve.data.data.type_a_boxShadow[4].join(',') + ')', // 类型a盒子阴影颜色
            type_a_backgroundImage: resolve.data.data.type_a_backgroundImage, // 类型a盒子背景图片
            type_a_backgroundSize: resolve.data.data.type_a_backgroundSize, // 类型a盒子背景图片大小
            backgroundImage: resolve.data.data.backgroundImage, // 网页背景图片
            type_b_opacity: resolve.data.data.type_b_opacity, // 类型b盒子背景透明度
            type_b_backgroundColor: 'rgba(' + resolve.data.data.type_b_backgroundColor.join(',') + ')', // 类型b盒子背景颜色raba
            type_b_fontColor: 'rgba(' + resolve.data.data.type_b_fontColor.join(',') + ')' // 类型b盒子字体颜色rgba
          }
          this.type_a_backgroundImage_btn = resolve.data.data.type_a_backgroundImage || '点击上传a盒子背景图片'
          this.backgroundImage_btn = resolve.data.data.backgroundImage || '点击上传网页背景图片'
        }).catch(reject => {
          window.publicFunction.error(reject, this)
        })
      }
    },
    created: function () {
      this.init()
    }
  }
</script>

<style scoped>
  .m-odr{
    overflow: auto;
    padding: 30px 30px 0 0;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }

  .s-wh-fl{
    width: 50%;
    float: left;
  }
</style>
