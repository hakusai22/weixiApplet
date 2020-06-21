/**
 * 
 * 点击加入购物扯
 * 1.先绑定点击事件
 * 2.获取缓存中的购物车数据 数组格式
 * 3.先判断 当前的商品是否已经存在于购物车
 * 4.已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
 * 5.不存在于购物车的数组中  直接给购物车数组添加一个新的元素 带上 购买数量属性num 
 * 重新把购物车数组 填充回缓存中
 */


 /**
  * 页面收藏
  * 1.页面onShow的时候 加载缓存中的商品收藏的数据
  * 2.判断当前商品是不是被收藏
  *   1.是  改变页面的图标
  *   2.不是
  * 
  * 3.点击商品收藏按钮
  *   1.判断该商品是否存在于缓存数组中
  *   1.存在  把该商品删除
  * 不存在 把商品添加到收藏数组中 存到缓存中即可
  */

import{request} from "../../request/index.js";
Page({
  data: {
      goodsObj:{},
      isCollect:false
  },
  //商品对象
  GoodsInfo:{}
  ,


  onShow: function () {
   let pages =  getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
      
      const {goods_id}=options;
      console.log(goods_id);
      this.getGoodsDetail(goods_id);


  },
  //获取商品详情数据
   async getGoodsDetail(goods_id){
     const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
     this.GoodsInfo=goodsObj;

           // 1.获取缓存中的商品收藏的数组
           let collect=wx.getStorageSync("collect")||[];
           //2.判断当前商品是否被收藏
           //some()函数 只要相等就返回true
           let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
     this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price, 
        //iphone 部分手机 不识别webp图片格式
        //临时自己改 确保后台存在 1.webp => 1.jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
      
    })
    },

    //点击轮播图 放大预览
    handlePreviewImage(e){
      //先构建要预览的图片数组
     const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
      //接收传递过来的图片url
       const current=e.currentTarget.dataset.url;
     wx.previewImage({
      current,
      urls
    });
    },

    //点击加入购物车
    handleCartAdd(){
      // 2.获取缓存中的购物车数据 数组格式
      let cart= wx.getStorageSync("cart")||[];
      // * 3.先判断 当前的商品是否已经存在于购物车
      let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
      // * 4.已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
      if(index===-1){
        //不存在 第一次添加
        this.GoodsInfo.num=1;
        this.GoodsInfo.checked=true;
        cart.push(this.GoodsInfo);
      }else{
        //已经存在 执行num++
        cart[index].num++;
      }
      //把购物车重新添加回缓存中
      wx.setStorageSync("cart",cart);
      //弹窗提示
      wx.showToast({
        title: '加入成功',
        icon:"success",
        mask: true
      });
        
    }

    ,
    //点击商品收藏图标
    handleCollect(){
      let isCollect=false;
      //1.获取缓存中的商品收藏数组
   let collect=wx.getStorageSync("collect")||[];
      //2.判断该商品是否被收藏过
     let index= collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //3.当index!=-1表示 已经收餐过了
    if(index!==-1){
      //在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title:'取消成功',
        icon:'success',
        mask:true,
      });
    }else{
      //没有收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title:'收藏成功',
        icon:'success',
        mask:true,
      });
    }
    //把数组存入到缓存中
    wx.setStorageSync("collect",collect);
    //修改data 的属性 isCollect
  this.setData({
    isCollect
  })
    }

})