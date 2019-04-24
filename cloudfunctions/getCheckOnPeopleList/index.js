// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
//获取课程信息
exports.main = async (event, context) => {
    return new Promise((resolve, reject) => {
        resolve(
            db.collection('courseList')
                .where({
                    courseName: event.courseName,
                })
                .get()
                // .get().then(res => console.log("okok" + res.data.studentId))
                .then(res => res)
        )
    })
}