const error = (error, vue) => {
  if (error.toString().indexOf('401') !== -1) {
    console.log('error', error)
    window.location.href = '/#/zh-cn/login'
  }
  if (error.toString().indexOf('500') !== -1) {
    vue.$message({
      type: 'error',
      message: '请求异常!'
    })
  }
}

export default {
  error: error
}
