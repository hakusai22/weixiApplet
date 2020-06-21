/*
1.用户上滑页面 滚动条触底 开始加载下一页数据
  1.找到滚动条触底事件
  2.判断还有没有下一页数据
    1.获取到总页数 只有总条数
      总页数=Math.ceil(总条数 /页容量 pagesize)
      获取当前的页面 pagenum
      判断一下 当前的页码是否大于等于 总页数
  3.假如没有下一页 弹出一个提示
  4.假如还有下一页数据 来加载下一页数据
    1.当前的页码++
    2.重新发送请求
    3.数据请求回来  要对data数组 进行拼接 而不是全部替换


下拉刷新页面 
1.触发下拉刷新事件
2.重置数据  数组
3.重置页码 设置为1
4.重新发送请求
5.数据请求回来 需要手动的关闭 等待效果
*/

import{request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goods_list:[]
  },
  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //全局参数  总页数
  totalPages:1,


  /**
   * 生命周期函数--监听页面加载 就调用
   */
  onLoad: function (options) {
    console.log("分类页面传过来的cid");
    console.log(options);
    //赋值给参数
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();

    

    
    
  },

//获取商品列表数据  同步方法
async getGoodsList(){
  const res=await request({url:"/goods/search",data:this.QueryParams});
  console.log("请求接口返回的数据");
  console.log(res);
  //获取总页数
 const total=res.total;
 //计算总页数
 this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
 
 console.log("当前总页数："+this.totalPages); 
 this.setData({
   //拼接数组
    goods_list:[...this.data.goods_list,...res.goods]
  })

  //关闭下拉刷新的窗口
 wx.stopPullDownRefresh();
    

},



  //标题点击事件 从子组件传递过来
handleTabstabItemChange(e){
  console.log(e);
  const {index}=e.detail;
  //修改源数组
  let {tabs}=this.data;
  tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
  //赋值到data中
  this.setData({
    tabs
  })

},

//页面上滑  滚动条触底事件
onReachBottom(){
  // console.log("页面触底");
  if(this.QueryParams.pagenum>=this.totalPages){
    // console.log("没有数据了");
    wx.showToast({title: '没有下一页数据了'});
      
  }
  else{
    // console.log(2);
    this.QueryParams.pagenum++;
    this.getGoodsList();
  }
},

//下拉刷新事件
onPullDownRefresh(){
  // console.log(12);
  //1.重置数组
  this.setData({
    goods_list:[]
  })
  //重置页码
  this.QueryParams.pagenum=1;
  //3.发送请求
  this.getGoodsList();
}



})