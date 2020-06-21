
//输入框绑定 值改变事件 input事件
  // 1.获取到输入框的值
    // 2.合法性判断
    //3.检验通过 把输入框的值 发送到后台
    //4.返回的数据打印到页面上


    //防抖
    //节流
    import{request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goods:[],
      isFocus:false,
      //输入框的值
      inputValue:""
  },

  //定时器
  TimeId:-1,

  //输入框的值改变 就会触发事件
  handleInput(e){
    // console.log(e);
    // 1.获取输入框的值
    const {value}=e.detail;
    //2.检验合法性
    if(!value.trim()){
      //值不合法
      return;
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
      this.qsearch(value);
    },1000);
  }
  ,
    //3.准备发送请求获取数据
    async qsearch(query){
      const res=await request({url:"/goods/search",data:{query}});
    this.setData({
      goods:res.goods
    })
    },

    //点击取消
    handleCancel(){
      this.setData({
        inputValue:"",
        isFocus:false,
        goods:[]
      })


    }
})