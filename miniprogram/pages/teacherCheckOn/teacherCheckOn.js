// miniprogram/pages/teacherCheckOn/teacherCheckOn.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        courseName:"",
        className:'',
        checkOnPeopleList:[],
        accountNum:''
    },
    endCheckOn(){
        wx.cloud.callFunction({
            // 云函数名称
            name: 'endCheckOn',
            // 传给云函数的参数
            data: {
                className: this.data.className,
                courseName: this.data.courseName,
                accountNum: this.data.accountNum,
            },
            complete: res => {
                console.log(res)
                wx.navigateBack({
                    delta: 2
                })
            },
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            courseName:options.courseName,
            className:options.className,
            accountNum: options.accountNum,
        })
        setInterval(()=>{
            wx.cloud.callFunction({
                // 云函数名称
                name: 'getCheckOnPeopleList',
                // 传给云函数的参数
                data: {
                    className: this.data.className,
                    courseName: this.data.courseName,
                },
                complete: res => {
                    console.log(this.data.checkOnPeopleList);
                    this.setData({
                        checkOnPeopleList: res.result.data[0].checkOnPeopleList
                    })
                },
            })
        },1000)
        
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