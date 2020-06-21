// pages/cart/cart.js

/**
 * 页面加载的时候
 *  1.从缓存中获得数据  渲染到页面中
 *      数据 checked=true
 * 2.微信支付
 *  1.哪些账号可以实现微信支付
 *    1.企业账号
 *    2.一个appid 可以绑定多个开发者
 * 
 * 3.支付按钮
 *  1.先判断缓存中有没有token
 *  2.没有 跳转到授权页面 进行获取token
 *  3.有token
 *  4.创建订单 获取订单编号
 * 
 */

import{request} from "../../request/index.js";
import{requestPayment, showToast} from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      address:{},
      cart:[],

      totalPrice:0,
      totalNum:0
  },

  onShow(){
    //获取缓存中的收获地址数据
    const address=wx.getStorageSync("address");
    //  //获取缓存中的购物车数据
    //当他是一个空字符串 不存在 就让他等于一个空数组
    let cart=wx.getStorageSync("cart")||[];
    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
  

    this.setData({address});

         //总价格 总数量
   let totalPrice=0;
   let totalNum=0;
   cart.forEach(v => {
       totalPrice+=v.num*v.goods_price;
       totalNum+=v.num;
   });


   this.setData({
     cart,
     totalPrice,
     totalNum,
     address
   });
  },
//点击支付
 async handleOrderPay(){
   try {
      //判断缓存中有没有token
    const token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    }
    //创建订单
    //准备请求头参数
    const header={Authorization:token};
    //请求体参数
    const order_price=this.data.totalPrice;
    const consignee_addr=this.data.address.all;
    const cart=this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }))
    const orderParams={order_price,consignee_addr,goods};
    //发送请求   创建订单 获取订单编号
    const {order_number}=await request({url:"/my/orders/create",method:"post",data:orderParams,header});
    //发起预支付接口
    const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"post",data:{order_number},header});
    //发起微信支付
   await requestPayment(pay);

    //查询后台 订单状态
    const res=await request({url:"/my/orders/chkOrder",method:"post",data:{order_number},header});
        console.log(res);
   } catch (error) {
     console.log(error);
     await showToast({title:"支付失败,余额不足,请充值"});
     wx.navigateTo({
       url:'/pages/order/order'
     });
     
   }
  }
})