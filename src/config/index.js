import ip from 'ip'

export default {
  // server: 'http://www.jiangyalin.com:8088',
  // upload: 'http://www.jiangyalin.com:8088'
  server: 'http://' + ip.address() + ':8088',
  upload: 'http://' + ip.address() + ':8088'
}
