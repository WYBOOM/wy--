// miniprogram/pages/teacherIndex/teacherIndex.js
const db = wx.cloud.database()
const teacherList = db.collection('teacherList') //教师集合
const _ = db.command


Page({

    /**
     * 页面的初始数据
     */
    data: {
        accountNum:'',
        passWord:null,
        Data:{},//教师数据
        createdCourse:[],//已创建的课程数组

        className:'',//新建班级名称
        courseName:'',//新建课程名称
        isCreate:false,//新建弹窗


        longitude: 0,
        latitude: 0,
        
    },

    inputCourseName(){
        this.setData({
            courseName: e.detail.value
        })
    }
    ,
    inputClassName() {
        this.setData({
            className: e.detail.value
        })
    }
,
    
    createCourse(){

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            accountNum:options.accountNum,
            passWord:options.passWord,
        })
        teacherList.where({
            accountNum: _.eq(this.data.accountNum),
            passWord: _.eq(Number.parseInt(this.data.passWord))
        }).get().then(res=>{
            this.setData({
                Data:res.data[0],
                createdCourse:res.data[0].createdCourse,
            })
            console.log(this.data.Data)
            // console.log(new Date().Format("yyyy-MM-dd hh:mm:ss"))
        })



        var that = this;
        wx.getLocation({
            type: "wgs84",
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                console.log(res.latitude);
                console.log(res.longitude);
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    markers: [{
                        latitude: res.latitude,
                        longitude: res.longitude
                    }]
                })
            },
            fail: function () {
                wx.showToast({
                    title: "定位失败",
                    icon: "none"
                })
            },

        })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})