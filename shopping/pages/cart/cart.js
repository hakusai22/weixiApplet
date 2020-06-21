// pages/cart/cart.js


import{getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      address:{},
      cart:[],
      allChecked:false,
      totalPrice:0,
      totalNum:0
  },


//回到商品详情页面 第一次添加商品的时候 手动添加了属性
  // num=1
//checked=true; 

//全选的实现 数据的展示
// onshow  获取缓存中的购物车数组
//所有的商品都被选中的时候 checked=true  

//总价格和总数量
// 获取购物车数组
//遍历
//判断商品是否被选中
//总价格+=商品的单价*商品的数量
// 把计算后的价格和数量 设置回data中即可


//商品的选中
// 1.绑定change事件
// 2.获取到被修改的商品对象
//3.商品对象的选中状态 取反
//4 重新填充回data中和缓存中
//5重新计算全选 总价格 总数量

// 全选和反选
// 绑定事件
// 1.获取 data中的全选变量 allChecked
//直接取反
//遍历购物车数组  商品 跟随allChecked 改变而改变
//把购物车数组和allChecked 重新设置回data 把购物车重新设置回缓存中


//商品数量的编辑
//"+" "-"按钮 绑定同一个点击事件 区分关键 自定义属性
  // "+" +1
  // "-"  -1
  // 2.传递被点击的商品id goods_id
  //获取data的购物车数组 来获取需要被修改的商品对象
  // 当 购物车的数量=1 同时用户点击-
    // 弹窗提示 是否要删除
      // 确定 执行删除
      // 取消 什么都不做
  //直接修改商品的对象数量 num
  // 把cart 数组 重新设置回缓存 中和data 中


  //点击结算
  // 判断有没有收获地址信息
  //判断用户有没有选购商品
  //跳转到支付页面


  onShow(){
    //获取缓存中的收获地址数据
    const address=wx.getStorageSync("address");
    //  //获取缓存中的购物车数据
    //当他是一个空字符串 不存在 就让他等于一个空数组
    const cart=wx.getStorageSync("cart")||[];

    this.setData({
      address
    });
    this.setCart(cart);
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击收货地址
 async handleChooseAddress(){
    // 2调用小程序内置 api 获取用户的收获地址

    //获取用户 对小程序 所授予获取地址的 权限 状态 scope  scope.address
      // 1.点击获取收货地址的提示框 确定 scope值为true
      //3. 重来没有调用过收货地址的api scope undefined
      //2.                        取消 scope值为false
        // 1.诱导用户 打开 授权设置页面 
        // 2.获取收获地址
      //4.把获取到的收获地址 存入到本地存储中

      //页面加载完毕
        //1.获取本地存储的地址数据
        //2.把数据设置给data中的一个变量
    // wx.getSetting({
    //   success: (result) => {
    //     const scopeAddress=result.authSetting["scope.address"];
    //     if(scopeAddress===true||scopeAddress===undefined){
    //       wx.chooseAddress({
    //         success:(result1)=>{
    //           console.log(result1);
    //         }
    //       });
    //     }else{
    //       //用户 拒绝过授权权限  诱导用户 打开 授权设置页面 
    //         wx.openSetting({
    //           success: (result2) => {
    //             //可以调用 收获地址代码
    //             wx.chooseAddress({
    //               success:(result3)=>{
    //                 console.log(result3);
    //               }
    //             });
    //           },
    //           fail: () => {},
    //           complete: () => {}
    //         });
              
    //     }
      
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });


    //获取 权限状态
try {
  const res1=await getSetting();
  const scopeAddress=res1.authSetting["scope.address"];
  //判断 权限状态
  if(scopeAddress===false){
      await openSetting();
  }
          //调用获取收获地址的api
          const address=await chooseAddress();
        // console.log(res2);
        //存入到缓存中
        wx.setStorageSync("address", address);
          
} catch (error) {
  console.log(error);
  
}

   



  },
//商品的选中
  handeItemChange(e){
      //获取被修改的商品id
      const goods_id=e.currentTarget.dataset.id;
      //获取购物车数组
      let {cart}=this.data;
      //找到被修改的商品对象
     let index= cart.findIndex(v=>v.goods_id===goods_id);
     //选中状态取反
     cart[index].checked=!cart[index].checked;
     //数据重新设置
    this.setCart(cart);

  },

  //设置购物车状态  重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
 
     //总价格 总数量
   let totalPrice=0;
   let totalNum=0;
   cart.forEach(v => {
     if(v.checked){
       totalPrice+=v.num*v.goods_price;
       totalNum+=v.num;
     }
   });
   //计算全选
   //只要一个回调函数返回false 那么不再循环执行 直接返回false
   
   //空数组 调用every 返回值就是true
   const allChecked=cart.length?cart.every(v=>v.checked):false;

   this.setData({
     cart,
     totalPrice,
     totalNum,
     allChecked
   });
   wx.setStorageSync("cart",cart);

  },

  //商品的全选功能
  handleItemAllCheck(){
    //1.获取data中的数据
    let {cart,allChecked}=this.data;
    //2.修改值
    allChecked=!allChecked;
    //循环修改cart 数组 中商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    //修改后的值填充回data 或者缓存中
    this.setCart(cart);
  },

  //商品数量的编辑功能
  async handleItemNumEdit(e){
    //获取传递过来的参数
      const {operation,id}=e.currentTarget.dataset;
     //获取购物车数组
     let {cart}=this.data;
     //找到需要修改的商品索引
     const index=cart.findIndex(v=>v.goods_id===id);
     //判断是否要执行删除
     if(cart[index].num===1&&operation===-1){
  
      const result=await showModal({content:"您是否要删除"});
      if(result.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }

     }else{
        //进行修改
        cart[index].num+=operation;
        //设置会data 缓存
        this.setCart(cart);
     }
    
  },

  //点击 商品结算
  async handlePay(){
    //判断收获地址
    const {address,totalNum}=this.data;
    if(!address.userName){      
      await showToast({title:"您还没有选择收获地址"});
      return;
    }
    if(totalNum===0){
      await showToast({title:"您还没有选择商品"});
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url:'/pages/pay/pay'
    });
  }
  
})