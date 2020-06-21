// pages/order/order.js
import{request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],

    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"代发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      },
    ],

  },

  onShow(options){
          //判断缓存中有没有token
          const token=wx.getStorageSync("token");
          if(!token){
            wx.navigateTo({
              url: '/pages/auth/auth'
            });
            return;
          }
    //获取当前的小程序的页面栈 -数组
    let pages =  getCurrentPages();
    //数组中 索引最大的页面就是当前页面
    let currentPage=pages[pages.length-1];
    // console.log(currentPage.options);
    const type=currentPage.options.type;
    //根据type激活页面标题
    this.changeTitleByIndex(type-1);
    
    this.getOrders(type,token);
      
    
  },

  //获取订单列表的方法
  async getOrders(type,token){
        //准备请求头参数
        // const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
        const header={Authorization:token};
      const res=await request({url:"/my/orders/all",data:{type},header,method:"get"});
      const orders=res.orders;
      
      this.setData({
        orders:orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
      })
      
  },

  //页面被打开的时候 onShow()
    // onshow 不同于onload 无法在形参上接收options参数
    //根据url上的参数type
    //根据type去发送请求获取订单数据
    //渲染页面
//点击不同标题 重新发送请求来获取和渲染参数


changeTitleByIndex(index){
    //修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //赋值到data中
    this.setData({
      tabs
    })
}
,
  //标题点击事件 从子组件传递过来
  handleTabstabItemChange(e){
    console.log(e);
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    //重新发送请求 type=1 index=0
    const token=wx.getStorageSync("token");
    this.getOrders(index+1,token);

  
  }
})