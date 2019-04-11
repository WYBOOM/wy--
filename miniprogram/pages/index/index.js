//index.js
const app = getApp()
const db = wx.cloud.database()
const teacherList = db.collection('teacherList') //教师集合
const _=db.command

Page({
    data: {
        avatarUrl: './user-unlogin.png',
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',

        isTeacher: false,
        isStudent: false,
        accountNum:'teacher01',//教师账号
        passWord:123456,//教师密码

    },
    //学生弹窗
    student() {
        this.setData({
            isStudent: true
        })
    },
    cancel() {
        this.setData({
            isStudent: false,
            isTeacher: false,
            accountNum:'',
            passWord:null,
        })
    },
    //老师弹窗
    teacher() {
        this.setData({
            isTeacher: true
        })
    },
    //教师登录
    teacherLogin(){
        console.log(this.data)
        teacherList.where({
            accountNum:_.eq(this.data.accountNum),
            passWord: _.eq(Number.parseInt(this.data.passWord))
        }).get().then(res => {
            console.log(res.data[0])
            if(res.data.length == 0){
                wx.showModal({
                    content: '输入的内容有误！请重新输入',
                    showCancel: false
                });
            }else{
                //跳转
                wx.navigateTo({
                    url: `../teacherIndex/teacherIndex?accountNum=${this.data.accountNum}&passWord=${this.data.passWord}`,
                })
            }
        })
    },

    //学生登录
    studentLogin(){
        wx.navigateTo({
            url: '../studentIndex/studentIndex',
        })
    },
    inputAccountNum:function(e){
        this.setData({
            accountNum:e.detail.value
        })
    },
    inputPassWord: function (e) {
        this.setData({
            passWord: e.detail.value
        })
    },
    

    login() {
        wx.redirectTo({
            url: '../databaseGuide/databaseGuide',
        })
    },
    bindPickerChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    onLoad: function() {
        if (!wx.cloud) {
            wx.redirectTo({
                url: '../chooseLib/chooseLib',
            })
            return
        }

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                avatarUrl: res.userInfo.avatarUrl,
                                userInfo: res.userInfo
                            })
                        }
                    })
                }
            }
        })
    },

    onGetUserInfo: function(e) {
        if (!this.logged && e.detail.userInfo) {
            this.setData({
                logged: true,
                avatarUrl: e.detail.userInfo.avatarUrl,
                userInfo: e.detail.userInfo
            })
        }
    },

    //   onGetOpenid: function() {
    //     // 调用云函数
    //     wx.cloud.callFunction({
    //       name: 'login',
    //       data: {},
    //       success: res => {
    //         console.log('[云函数] [login] user openid: ', res.result.openid)
    //         app.globalData.openid = res.result.openid
    //         wx.navigateTo({
    //           url: '../userConsole/userConsole',
    //         })
    //       },
    //       fail: err => {
    //         console.error('[云函数] [login] 调用失败', err)
    //         wx.navigateTo({
    //           url: '../deployFunctions/deployFunctions',
    //         })
    //       }
    //     })
    //   },

    // 上传图片
    //   doUpload: function () {
    //     // 选择图片
    //     wx.chooseImage({
    //       count: 1,
    //       sizeType: ['compressed'],
    //       sourceType: ['album', 'camera'],
    //       success: function (res) {

    //         wx.showLoading({
    //           title: '上传中',
    //         })

    //         const filePath = res.tempFilePaths[0]

    //         // 上传图片
    //         const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
    //         wx.cloud.uploadFile({
    //           cloudPath,
    //           filePath,
    //           success: res => {
    //             console.log('[上传文件] 成功：', res)

    //             app.globalData.fileID = res.fileID
    //             app.globalData.cloudPath = cloudPath
    //             app.globalData.imagePath = filePath

    //             wx.navigateTo({
    //               url: '../storageConsole/storageConsole'
    //             })
    //           },
    //           fail: e => {
    //             console.error('[上传文件] 失败：', e)
    //             wx.showToast({
    //               icon: 'none',
    //               title: '上传失败',
    //             })
    //           },
    //           complete: () => {
    //             wx.hideLoading()
    //           }
    //         })

    //       },
    //       fail: e => {
    //         console.error(e)
    //       }
    //     })
    //   },


})