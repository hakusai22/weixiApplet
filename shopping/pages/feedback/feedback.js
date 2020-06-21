

/**
 * 1.点击+ 触发tap点击事件
 *  调用小程序内置的 选择图片的api 
 *  获取到图片的路径 数组
 *  把图片路径 存到data的变量中
 * 页面就可以 进行循环显示
 * 
 * 2.点击自定义图片 组件
 *  1.获取被点击的元素的索引
 *  2.获取data中的图片数组
 * 3.根据索引 数组中删除对应的元素
 * 4.把数组重新设置会data中
 * 
 * 3.点击提交 
 *  1.获取文本域的内容
 *      绑定输入事件
 *  2.对这些内容 合法性的验证
 * 3.验证通过 用户选择的图片 上传到服务器
 * 4.文本域金额外网的图片路径 提交到服务器
 * 5.清空当前页面
 * 6返回上一页
 * 
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商家投诉",
        isActive:false
      }
    ],
    //被选中的图片的路劲 数组
    chooseImgs:[],
    //文本域的内容
    textVal:""

  },
//外网的图片的路劲数组
    uploadImgs:[],
  
  handleTabstabItemChange(e){
    const {index}=e.detail;
       //修改源数组
       let {tabs}=this.data;
       tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
       //赋值到data中
       this.setData({
         tabs
       })
  },
  //点击+ 按钮
  handleChooseImg(){
    wx.chooseImage({
      //同时选择的图片格式
      count: 9,
      sizeType: ['original', 'compressed'],
      //来源
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result);
        this.setData({
          //图片数组进行拼接
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      },
      fail: () => {},
      complete: () => {}
    });
      

  },

  //点击 自定义图片组件
  handleRemoveImg(e){
    //2.获取被点击的组件的索引
   const {index}= e.currentTarget.dataset;
   console.log(index);
   //3.获取data图片数组
   let {chooseImgs}=this.data;
   //删除元素
   chooseImgs.splice(index,1);
   this.setData({
     chooseImgs
   })
   
  },

  //文本域的输入事件
  handleText(e){
      this.setData({
        textVal:e.detail.value
      })
  },
//提交按钮的点击
  handleFormSubmit(){
    const {textVal,chooseImgs}=this.data;
    //合法性的验证
    if(!textVal.trim()){
      //不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      
      });
      return;
    }

    
    //上传图片到服务器
    //不支持多个api 多个文件上传  挨个上传
    wx.showLoading({
      title:"正在上传" ,
      mask: true
    });

    //判断有没有需要上传的图片数组
    if(chooseImgs.length!=0){
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
          url: 'https://img.coolcr.cn/index/api.html',
          filePath: v,
          name: "image",
          formData: {},
          success: (result) => {
            console.log(result);
            wx.hideLoading();
              
            wx.showToast({
              title: '上传成功',
              icon: 'none',
              image: '',
              duration: 1500,
              mask: false
            });
            // 重置页面
            this.setData({
              textVal:"",
              chooseImgs:[]
            })
  
            //返回上一个页面
            wx.navigateBack({
              delta: 1
            });
              
          }
        });
      })
  
    }else{
      wx.hideLoading();
      wx.navigateBack({
        delta:1
      });
    }
      
  
 
      
  }


})