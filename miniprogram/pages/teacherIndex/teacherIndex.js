// miniprogram/pages/teacherIndex/teacherIndex.js
const db = wx.cloud.database()
const teacherList = db.collection('teacherList') //教师集合
const _ = db.command
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        accountNum: '',
        passWord: null,
        Data: {}, //教师数据
        createdCourse: [], //已创建的课程数组

        className: '', //新建班级名称
        courseName: '', //新建课程名称
        isCreate: true, //新建弹窗


        longitude: 0,
        latitude: 0,

        circle: [], //显示的圆形

        distances:[20,50,100,200], //距离范围
        distancesIndex:0,//当前距离
        

    },

    inputCourseName(e) {
        this.setData({
            courseName: e.detail.value
        })
    },
    inputClassName(e) {
        this.setData({
            className: e.detail.value
        })
    },

    createCourse() {
        this.setData({
            isCreate:false,
            className:'',
            courseName:'',
        })
    },

    cancel(){
        this.setData({
            isCreate:true
        })
    },
    //改变半径
    bindDistanceChange(e){
        this.setData({
            distancesIndex: e.detail.value,
            circle:[{
                latitude:this.data.latitude,
                longitude:this.data.longitude,
                fillColor: "#7cb5ec88",
                strokeWidth: 1,
                radius: this.data.distances[e.detail.value],
            }]
        })
    },
    //创建新课程
    create(){
        teacherList.doc(this.data.accountNum).update({
            data:{
                createdCourse: _.push({
                    className:this.data.className,
                    courseName:this.data.courseName,
                    creationTime:new Date(),
                    location: new db.Geo.Point(this.data.longitude,this.data.latitude)
                
                })
            }
        }).then(res=>{
            this.setData({
                isCreate:true,
            })
                console.log(res)
        }).catch(error=>{
            console.log(error);
        })

    },
    //点击课程
    tapItem(e){
        wx.navigateTo({
            url: `../teacherCourse/teacherCourse?courseName=${e.currentTarget.dataset.text}&accountNum=${this.data.accountNum}`,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            accountNum: options.accountNum,
            passWord: options.passWord,
        })
        teacherList.where({
            accountNum: _.eq(this.data.accountNum),
            passWord: _.eq(Number.parseInt(this.data.passWord))
        }).get().then(res => {
            this.setData({
                Data: res.data[0],
                createdCourse: res.data[0].createdCourse,
            })
            console.log(this.data.Data)
            // console.log(new Date().Format("yyyy-MM-dd hh:mm:ss"))
        })



        var that = this;
        wx.getLocation({
            type: "gcj02",
            success: function(res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                console.log(res.latitude);
                console.log(res.longitude);
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    circle: [{
                        latitude: res.latitude,
                        longitude: res.longitude,
                        fillColor: "#7cb5ec88",
                        strokeWidth:1,
                        radius: 20,
                    }]
                })
            },
            fail: function() {
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
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})