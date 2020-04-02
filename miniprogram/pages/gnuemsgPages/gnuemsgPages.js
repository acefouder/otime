//连接数据库
const db = wx.cloud.database();
const message = db.collection("gnuemessage");
const author = db.collection("author");
// const collection = db.collection("collection");
// const app = getApp();
//const lessonSubId = 'I74TH_gAAUjOF8uSKzriTb4dNYDY4cQUK2WYwiGgog4'; //订阅消息模板id：wpWjGZ2n58TiFg_tkTpXj3zUhFjmeOaHwNVl1WmSOD4


Page({
  

  data: {
    authority: false,
    show: false,  //是否弹出留言面板
    textValue: "",
    loading: true,  //是否正在加载
    collected:false,
    qr: "",
    userId: "",  //用户openid
    //留言数据
    pageId: "",
    title: "",
    images: "",
    zuozhe: "",
    text: "",
  
  },



  //获取用户信息
  onInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.errMsg === "getUserInfo:ok") {
      this.showPopup()
      this.setData({
        imageSrc: e.detail.userInfo.avatarUrl,
        name: e.detail.userInfo.nickName,
        //userId: e.detail.userInfo.openid,//获取用户id
      })
    }
  },

  //判断用户权限
  authentication: function () {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        // console.log(res)
        this.setData({
          userId: res.result.openid
        })
        db.collection('author').get().then(res2 => {
          // console.log(res.result.event.userInfo.openId)
          // console.log(res2.data[0]._openid)
          if (res.result.openid === res2.data[0]._openid) {
            this.setData({
              authority: true
            })
          }
        })
      }
    })
  },



  //允许订阅回复消息
  subReply: function (e) {

    wx.requestSubscribeMessage({
      tmplIds: [lessonSubId],
      success: res => {
        // console.log('已授权接收订阅消息')
        wx.showToast({
          title: "留言成功",
          icon: "success",
          success: res2 => {
            this.setData({
              textValue: ""
            });
            this.getData();
          }
        })
      }
    })
  },



  //提交留言
  onSubmit: function (e) {
    // console.log(e.detail.value.msgInput);

    console.log(e.detail.value.msgInput);
    message.add({
      data: {
        title: e.detail.value.pageTitle,
        text: e.detail.value.pageText,
        zuozhe: e.detail.value.pageZuozhe,
        images: e.detail.value.pageImages,
        pageId: this.data.pageId,
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
    //检测留言是否违规
    // wx.cloud.callFunction({
    //   name: 'msgCheck',
    //   data: {
    //     content: e.detail.value.msgInput 	//传入我得到的文本内容
    //   }
    // }).then(ckres => {
    //   console.log(ckres)
    //   //写审核通过之后的操作 if == 0
    //   if (ckres.result.errCode == 0) {
    //     message.add({
    //       data: {
    //         imageSrc: this.data.imageSrc,//检测上传图片违规
    //         name: this.data.name,
    //         text: e.detail.value.msgInput,
    //         pageId: this.data.pageId,
    //       }
    //     })
    //   } else {
    //     wx.showModal({
    //       title: '留言失败',
    //       content: '检测到敏感词,请注意言论',
    //       showCancel: false
    //     })
    //   }
    // })

    //未改动前提交数据的方法
    // message.add({

    //   data: {
    //     imageSrc: this.data.imageSrc,
    //     name: this.data.name,
    //     text: e.detail.value.msgInput,
    //     pageId:this.data.pageId,
    //     good: false, //判断有无人点赞
    //   }
    // })
  },


  // 页面刷新获取数据
  getData: function (e) {
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        id: this.data.pageId,
        db: 'gnuemessage',
      }
    }).then(res => {
      console.log(res.result.data)
      this.setData({
        msgList: res.result.data,
        loading: false
      })
    })
  },

 

  //获得小程序码
  getQ: function (e) {
    wx.cloud.callFunction({
      name: 'getQ',
      data: {
        path: `pages/gnuemsgPages/gnuemsgPages?id=${this.data.pageId}`,
        id: this.data.pageId,
      }
    }).then(res => {
      this.setData({
        qr: res.result.fileID
      })
      console.log(res)
      console.log(this.data.qr)
    })
  },


  //复制页面路径
  copyPage: function (e) {
    wx.setClipboardData({
      data: `pages/gnuemsgPages/gnuemsgPages?id=${this.data.pageId}`,
      // success(res) {
      //   wx.getClipboardData({
      //     success(res) {
      //       console.log(res.data) // data
      //     }
      //   })
      // }
    })
  },

  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
 


  postCollection:function(){
    wx.navigateBack({
      url:'../gnue/gnue'
    })

  },








  // 监听页面加载
  onLoad: function (options) {
    // console.log(options.id)

    //判断用户是否登陆
    // onLoad: async function (options) {
    // let that = this;
    // app.checkUserInfo(function (userInfo, isLogin) {
    //   if (!isLogin) {
    //     that.setData({
    //       showLogin: true
    //     })
    //   } else {
    //     that.setData({
    //       userInfo: userInfo
    //     });
    //   }
    // });

    this.authentication();
    this.setData({
      pageId: options.id
    })
    this.getData();
  },







  // 监听下拉
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target, res)
    }
    return {
      title: '时光故事',
      path: 'pages/gnue/gnue',
      imageUrl: '../../image/ab3.jpg'
    }
  },


  



})