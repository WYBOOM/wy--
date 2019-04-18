var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const db = wx.cloud.database()
const studentList = db.collection('studentList') //教师集合
const courseList = db.collection('courseList') //课程集合 
const _ = db.command

Page({
    data: {
        tabs: ["我的课程", "全部课程"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,


        studentData: {}, //当前数据
        courseList: [], //课程集合
    },
    tapItem(e) {
        wx.navigateTo({
            url: `../studentCheckOn/studentCheckOn?courseName=${e.currentTarget.dataset.text.courseName}`,
        })
        // db.collection('studentList').where({
        //     studentId: 201521113000
        // }).get().then(res=>console.log(res.data))
    },
    tapItem2(e) {
        console.log(e.currentTarget.dataset.text)
        var studentId;
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定要将该课程添加进我的课程吗？',
            success(res) {
                if (res.confirm) {
                    wx.getStorage({
                        key: 'studentId',
                        success: function (res) {
                            studentId = res.data;
                            wx.cloud.callFunction({
                                // 云函数名称
                                name: 'addStudentCourse',
                                // 传给云函数的参数
                                data: {
                                    course: e.currentTarget.dataset.text,
                                    studentId: studentId,
                                },
                                complete: res => {
                                    that.onLoad({ 1: 1 });
                                },
                            })
                        },
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
        


    },
    onLoad: function(options) {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });

        studentList.doc('201521113000').get().then(res => {
            this.setData({
                studentData: res.data,
            })
            // console.log(new Date().Format("yyyy-MM-dd hh:mm:ss"))
        })
        courseList.get().then(res => {
            this.setData({
                courseList: res.data
            })
        })

    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
});