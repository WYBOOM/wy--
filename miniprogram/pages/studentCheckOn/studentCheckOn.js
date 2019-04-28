// miniprogram/pages/studentCheckOn/studentCheckOn.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        courseData:{},
        longitude: 0,
        latitude: 0,

        circle: [], //显示的圆形
        checkOnCode:null,
        myLongitude:0,
        myLatitude:0,
        studentId:'',
        studentName:'',
    },
    inputCode: function (e) {
        this.setData({
            checkOnCode: e.detail.value
        })
    },
    checkOn(){
        wx.cloud.callFunction({
            // 云函数名称
            name: 'studentCheckOn',
            // 传给云函数的参数
            data: {
                checkOnCode:this.data.checkOnCode,
                courseName:this.data.courseData.courseName,
                latitude: this.data.myLatitude,
                longitude: this.data.myLongitude,
                studentId:this.data.studentId,
                studentName:this.data.studentName,

            },
            complete: res => {
                console.log(res);
                if(res.result == false){
                    wx.showModal({
                        title: '提示',
                        content: '考勤口令错误或课程未在考勤中！',
                        showCancel:false,
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            }
                        }
                    })
                }else{
                    wx.showModal({
                        title: '提示',
                        content: '考勤完成',
                        showCancel: false,
                        success:res=> {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            }
                            wx.navigateBack({
                                url: `../studentIndex/studentIndex?studentId=${this.data.studentId}&studentName=${this.data.studentName}`
                            })
                        }
                    })
                }
            },
        })




        var that = this;
        wx.checkIsSupportSoterAuthentication({
            success(res) {
                for (var i in res.supportMode) {
                    if (res.supportMode[i] == 'fingerPrint') {
                        console.log("支持指纹识别", res.supportMode[i]);
                        wx.startSoterAuthentication({
                            requestAuthModes: ['fingerPrint'],
                            challenge: '123456',
                            authContent: '请用指纹',
                            success(res) {
                                console.log("识别成功", res)
                                show("提示", "识别成功", false);
                            },
                            fail(res) {
                                console.log("识别失败", res)
                                show("提示", "识别失败", false);
                            }
                        })
                    } else if (res.supportMode[i] == 'facial') {
                        console.log("支持人脸识别", res.supportMode[i]);
                    }
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            studentId: options.studentId,
            studentName: options.studentName,
        })
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getCheckOnPeopleList',
            // 传给云函数的参数
            data: {
                courseName: options.courseName,

            },
            complete: res => {
                console.log(res.result.data[0])
                this.setData({
                    courseData: res.result.data[0],
                    latitude: res.result.data[0].latitude,
                    longitude: res.result.data[0].longitude,
                    circle:[{
                        latitude: res.result.data[0].latitude,
                        longitude: res.result.data[0].longitude,
                        fillColor: "#7cb5ec88",
                        strokeWidth: 1,
                        radius: res.result.data[0].distance,
                    }]
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
        wx.getLocation({
            type: 'gcj02',
            success: res => {
                this.setData({
                    myLongitude: res.longitude,
                    myLatitude: res.latitude,
                })
            }
        })
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