
const db = wx.cloud.database();
const msgpages = db.collection("aboutmsgpages");
const author = db.collection("author");
Page({


  data: {
    authority: false,
    show: false,  //是否弹出留言面板
    textValue: "",
    loading: true,  //是否正在加载
    pageList: []
  },

  //提交创建新页面
  onSubmit: function (e) {
    console.log(e.detail.value.msgInput);
    msgpages.add({
      data: {
        name: e.detail.value.pageName,
        discribe: e.detail.value.pageDiscribe,
        adress: e.detail.value.pageAdress,
        imgsrc: e.detail.value.pageImgsrc,
        or: e.detail.value.pageOr,
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
        db: 'aboutmsgpages',
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

  onLoad: function (options) {
    this.getData();
    this.authentication();




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
    this.back.src = "https://7765-wentan-zgz72-1301696266.tcb.qcloud.la/music/%E9%99%AA%E4%BD%A0%E5%8E%BB%E6%B5%81%E6%B5%AA%20-%20%E8%96%9B%E4%B9%8B%E8%B0%A6.mp3?sign=a1ea5b6fcdacaa48034c0d3bba0fbd18&t=1585594543"
    this.back.title = '陪你去流浪'   // 标题为必选项
    this.back.play()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onShareAppMessage: function () {

  }
})