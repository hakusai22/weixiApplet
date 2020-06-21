//Page Object
//引入用来发送的方法
import{request} from "../../request/index.js";
Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航 数组
    catesList:[],
    //楼层数据
    floorList:[]

   
  },
  //页面加载就会触发
  onLoad:function(options){
    //1.发送异步请求获取轮播图数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
    //同时发送三个异步请求
      this.getSwiperList();
      this.getCateList();
      this.getFloorList();
    },
    //获取轮播图数据
    getSwiperList(){
      request({url:"/home/swiperdata"})
      .then(result =>{
        this.setData({
                swiperList:result
              })
      })
    },
    //获取分类导航数据
    getCateList(){
      request({url:"/home/catitems"})
      .then(result =>{
        this.setData({
          catesList:result
              })
      })
    },

        //获取楼层数据
        getFloorList(){
          request({url:"/home/floordata"})
          .then(result =>{
            console.log(result);
            
            this.setData({
              floorList:result
                  })
          })
        }
});
  