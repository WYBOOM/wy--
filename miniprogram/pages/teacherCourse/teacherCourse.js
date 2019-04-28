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
        isCreate:true,
        tabs: ["我要考勤","历史考勤"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        courseData:{},//课程数据
        distances: [20, 50, 100, 200], //距离范围
        distancesIndex: 0,//当前距离index

        checkInPassWord:1111,//考勤口令
        options:{},
        msg:''
    },

    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },

    //改变半径
    bindDistanceChange(e) {
        this.setData({
            distancesIndex: e.detail.value,
        })
    },
    //开始考勤
    checkOn(){
        var that = this;
        wx.cloud.callFunction({
            // 云函数名称
            name: 'beginCheckOn',
            // 传给云函数的参数
            data: {
                className:this.data.courseData.className,
                courseName: this.data.courseData.courseName,
                checkOnCode: this.data.checkInPassWord,
                distance:this.data.distances[this.data.distancesIndex],
                latitude: this.data.courseData.location.latitude,
                longitude: this.data.courseData.location.longitude,
            },
            complete: res => {
                that.onLoad(this.data.options);
                wx.navigateTo({
                    url: `../teacherCheckOn/teacherCheckOn?courseName=${this.data.courseData.courseName}&className=${this.data.courseData.className}&accountNum=${this.data.options.accountNum}`,
                })
            },
        })
    },

    inputPassWord(e) {
        this.setData({
            checkInPassWord: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        this.setData({
            options:options
        })
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
                )[0],
                
            })
            if (typeof (this.data.courseData.historyCheckOn) == 'undefined'||this.data.courseData.historyCheckOn.length == 0){
                this.setData({
                    msg:'暂无数据~'
                })
            }
          
            console.log(this.data.courseData)
            console.log(typeof (this.data.courseData.historyCheckOn) == 'undefined')
        }).catch(error=>{
            console.log(error)
        })
        
    },

    //点击查看历史缺勤人员
    tapItem(e){
        console.log(e.currentTarget.dataset.text);
        wx.setStorage({
            key: "unusualPeopleList",
            data: e.currentTarget.dataset.text
        })
        wx.navigateTo({
            url: `../unusualPeopleList/unusualPeopleList`,
        })
    },

    openMap(){
        wx.openLocation({
            latitude: this.data.courseData.location.latitude,
            longitude: this.data.courseData.location.longitude,
            scale: 18
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