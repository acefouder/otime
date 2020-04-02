const db = wx.cloud.database();
const msgpages = db.collection("usecont");
const app = getApp()

Page({
  data: {
    avatarUrl: 'https://7765-wentan-zgz72-1301696266.tcb.qcloud.la/tubiao/user-unlogin.png?sign=c07bc65361528c02a602f999867adb71&t=1585648414',
    userInfo: {},
    modalHidden: true,
    logged: false,
    takeSession: false,
    requestResult: '',
//tab数据
     flag: 0,

     scont: ["赠人玫瑰，手留余香", "想要的明天，将如约而至", "时光很短，请勿忧伤"]


  },



  sendEmail() {

    wx.cloud.callFunction({

      name: "sendEmail",

      success(res) {

        console.log("发送成功", res)

      },
      fail(res) {

        console.log("发送失败", res)

      }

    })

  },





//提交用户内容




// 检测前的提交方法

    onSubmit: function (e) {
    console.log(e.detail.value.msgInput);
    msgpages.add({
      data: {
        name: e.detail.value.pageName,
        youxiang: e.detail.value.pageYouxiang,
        content: e.detail.value.pageContent,
      }
    }).then(res => {
      wx.showToast({
        title: "发送成功",
        icon: "success",
        success: res2 => {
          this.setData({
            textValue: ""
          });
          // this.getData();
        }
      })
    })
  },










//分享页面
  onShareAppMessage: function(res){
    if(res.from === 'button'){
      console.log(res.target, res)
    }
return{
   title:'相遇美好',
   path:'pages/user/user',
   imageUrl:'../../image/ab2.jpg'
}

  },
  /**
      * 显示弹窗
      */
  // buttonTap: function () {
  //   this.setData({
  //     modalHidden: false
  //   })
  // },

  // /**
  //  * 点击取消
  //  */
  // modalCandel: function () {
  //   // do something
  //   this.setData({
  //     modalHidden: true
  //   })
  // },

  // /**
  //  *  点击确认
  //  */
  // modalConfirm: function () {
  //   // do something
  //   this.setData({
  //     modalHidden: true
  //   })
  // },
  //发送邮件





  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../index/index',
      })
      return
    }
   //广告插入
    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: 'adunit-8a6829990396f0e0'
    //   })
    //   interstitialAd.onError(err => {
    //     console.log(err);
    //   })
    // }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  // onShow: function () {
  //   if (interstitialAd) {
  //     interstitialAd.show().catch((err) => {
  //       console.error(err)
  //     })
  //   }
  // },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../touxiang/touxiang',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../about/about',
        })
      }
    })
  },

  
//tabselect
  switchNav: function (e) {
    console.log(e.currentTarget.id);
    this.setData({
      flag: e.currentTarget.id
    })
  },








})
