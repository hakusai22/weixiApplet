import{request} from "../../request/index.js";
import{login} from "../../utils/asyncWx.js";
Page({


 async  handleGetUserInfo(e){
try {
      // console.log(e);
    //获取用户信息
    const {encryptedData,signature,rawData,iv}=e.detail;
  //获取小程序登录成功后的code
 
    const {code}=await login();
    console.log(code);
    const loginParams={encryptedData,signature,rawData,iv,code}
    //发送请求获取用户的token 
    const res= await request({url:"/my/orders/req_unifiedorder",data:loginParams,method:"post"})
    const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
    console.log(token);
    wx.setStorageSync("token", token);
    wx.navigateBack({
      delta:1
    });
} catch (error) {
  console.log(error);
}
      
  }


})