//连接数据库
const db = wx.cloud.database();
const msgpages = db.collection("msgpages");
const author = db.collection("author");
Page({


  data: {
    authority: false,
    show: false,  //是否弹出留言面板
    textValue: "",
    loading: true,  //是否正在加载

    pageList:[]
  },

  //提交创建新页面
  onSubmit: function (e) {
    console.log(e.detail.value.msgInput);
    msgpages.add({
      data: {
        name: e.detail.value.pageName,
        discribe: e.detail.value.pageDiscribe,
      }
    }).then(res => {
      wx.showToast({
        title: "新建成功",
        icon: "success",
        success: res2 => {
          this.setData({
            textValue: ""
          });
          this.getData();
        }
      })
    })
  },

  // 页面刷新获取数据
  getData: function (e) {
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        db: 'msgpages',
        id: null,
      }
    }).then(res => {
      console.log(res.result.data)
      this.setData({
        pageList: res.result.data,
        loading: false
      })
      // wx.stopPullDownRefresh
    })
  },

  //判断用户权限
  authentication: function () {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        db.collection('author').get().then(res2 => {
          if (res.result.openid === res2.data[0]._openid) {
            this.setData({
              authority: true
            })
          }
        })
      }
    })
  },

  //弹出面板设置
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },

//分享设置

  onLoad: function (options) {
    this.getData();
    this.authentication();
//插屏广告
    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: 'adunit-088b289e55a4b378'
    //   })
    //   interstitialAd.onError(err => {
    //     console.log(err);
    //   })
    // }
  },

  onPullDownRefresh: function () {
    this.setData({
      loading: true
    });
    this.getData();
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.back = wx.getBackgroundAudioManager()

    // 对实例进行设置
    this.back.src = "https://7765-wentan-zgz72-1301696266.tcb.qcloud.la/music/%E6%97%B6%E5%85%89.mp3?sign=924e8310ba691671ea4f3a97b7debe19&t=1585595792"
    this.back.title = '时光'   // 标题为必选项
    this.back.play()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (interstitialAd) {
    //   interstitialAd.show().catch((err) => {
    //     console.error(err)
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target, res)
    }
    return {
      title: '时光印记',
      path: 'pages/indexe/index',
      imageUrl: '../../image/ab2.jpg'
    }
  }
})