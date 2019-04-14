// miniprogram/pages/teacherCourse/teacherCourse.js
var sliderWidth = 96;
const db = wx.cloud.database()
const teacherList = db.collection('teacherList') //教师集合
const _ = db.command

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: ["我要考勤","历史考勤"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        courseData:{},//课程数据
    },

    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
            wx.setNavigationBarTitle({
                title: options.courseName
            })
        teacherList.doc(options.accountNum).get().then(res=>{
            
            this.setData({
                courseData:res.data.createdCourse.filter(item=>
                    item.courseName == options.courseName
                )[0]
            })
            console.log(this.data.courseData)
        }).catch(error=>{
            console.log(error)
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