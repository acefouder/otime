
const cloud = require('wx-server-sdk')
const {
  WXMINIUser,
  WXMINIQR
} = require('wx-js-utils');

cloud.init()

const appId = 'wx306aa10f7141b583'; // 小程序 appId
const secret = 'b7d3523145196e706178ab65291209ea'; // 小程序 secret


exports.main = async (event, context) => {

  // 获取小程序码，A接口
  let wXMINIUser = new WXMINIUser({
    appId,
    secret
  });

  // 一般需要先获取 access_token
  let access_token = await wXMINIUser.getAccessToken();
  let wXMINIQR = new WXMINIQR();

  let qrResult = await wXMINIQR.getMiniQRLimit({
    access_token,
    path:event.path
  });

  return await cloud.uploadFile({
    cloudPath:`${event.id}.jpg`,
    fileContent: qrResult
  })
}