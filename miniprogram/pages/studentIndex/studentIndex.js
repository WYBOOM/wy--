var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const db = wx.cloud.database()
const studentList = db.collection('studentList') //教师集合
const _ = db.command

Page({
    data: {
        tabs: ["我的课程", "全部课程"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,


        studentData:{},//当前数据
    },
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

        studentList.doc('201521113000').get().then(res => {
            this.setData({
                studentData: res.data,
            })
            // console.log(new Date().Format("yyyy-MM-dd hh:mm:ss"))
        })

    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
});