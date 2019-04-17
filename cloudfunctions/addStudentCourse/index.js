// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command


// 云函数入口函数
//从全部课程中添加入我的课程 需要传入 ： 课程对象 学生id
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()
    await db.collection('studentList').doc(event.studentId).update({
        data: {
            myCourse: _.push({
                className: event.course.className,
                courseName: event.course.courseName,
            })
        }
    }).then(res => console("okokokok" + res.data))
    return {
        addStudentCourse:event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,

    }
}