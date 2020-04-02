//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'wentan-zgz72',
        traceUser: true,
      })
    }

    this.globalData = {}
  }


//判断是否登陆
  // checkUserInfo: function (cb) {
  //   let that = this
  //   if (that.globalData.userInfo) {
  //     typeof cb == "function" && cb(that.globalData.userInfo, true);
  //   } else {
  //     wx.getSetting({
  //       success: function (res) {
  //         if (res.authSetting['scope.userInfo']) {
  //           // 已经授权，可以直接调用 getUserInfo 获取头像昵称
  //           wx.getUserInfo({
  //             success: function (res) {
  //               that.globalData.userInfo = JSON.parse(res.rawData);
  //               typeof cb == "function" && cb(that.globalData.userInfo, true);
  //             }
  //           })
  //         } else {
  //           typeof cb == "function" && cb(that.globalData.userInfo, false);
  //         }
  //       }
  //     })
  //   }
  // }




})
