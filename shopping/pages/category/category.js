import{request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //左侧的菜单
    leftMenuList:[],
    //右侧的商品数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
//调用接口的返回数据
  Cates :[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    1.先判断一下本地存储中有没有旧的数据
    2.没有旧的数据 直接发送新的请求
    3.有旧的数据 也没有过期 就使用本地存储的旧数据
    */

   //获取本地存储的数据
 const Cates = wx.getStorageSync("cates");
     //判断 
     if(!Cates){
       //直接发送新的请求
      this.getCates();
     }else{
        //有旧的数据 定义过期时间
        if(Date.now-Cates.time>1000*10){
          this.getCates();
        }else{
          //使用本地存储
          this.Cates=Cates.data;
           //构造左侧的大菜单数据  把名字筛选出来
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        //构造右侧的商品数据
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
        }

      
     }

  },
  //获取分类的数据
 async getCates(){
    // request({
    //   url:"/categories"
    // })
    // .then(res =>{
    //     this.Cates=res.data.message;

    //     //把接口数据存入本地存储中
    //     wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
    //     //构造左侧的大菜单数据
    //     let leftMenuList=this.Cates.map(v=>v.cat_name);

    //     //构造右侧的商品数据
    //     let rightContent=this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    // })

    // 同步方法
    const res=await request({url:"/categories"});
    console.log(res);
      // this.Cates=res.data.message;
      this.Cates=res;
            //把接口数据存入本地存储中
        wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});


        //构造左侧的大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name);

        //构造右侧的商品数据
        let rightContent=this.Cates[0].children;

        //传入到data数据中
        this.setData({
          leftMenuList,
          rightContent
        })
  },

  //左侧菜单的点击事件
  handleItemTap(e){
    console.log(e);
    //获取当前的index
      const {index}=e.currentTarget.dataset;
      //根据index获取到 右侧数据
      let rightContent=this.Cates[index].children;

      this.setData(
        {
          currentIndex:index,
          rightContent
        }
      )
      //重新设置右侧内容的scroll-view 标签的距离顶部的距离
      scrollTop:0
  }


})