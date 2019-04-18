// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command


// 云函数入口函数
//从全部课程中添加入我的课程 需要传入 ： 课程对象 学生id
exports.main = async(event, context) => {
    // const wxContext = cloud.getWXContext()
    // await db.collection('studentList').doc(event.studentId).update({
    //     data: {
    //         myCourse: _.push({
    //             className: event.course.className,
    //             courseName: event.course.courseName,
    //         })
    //     },
    //     success(res) { //成功打印消息
    //         console.log('okokok', res)
    //     },
    //     fail(res) { //存入数据库失败
    //         console.log('订单存入数据库操作失败');
    //   //云函数更新
    //     }
    // })

    return new Promise((resolve, reject) => {
        resolve(
            db.collection('studentList').doc(event.studentId.toString())
            .update({
                data: {
                    myCourse: _.push({
                        className: event.course.className,
                        courseName: event.course.courseName,
                    }),
                }
            })
                // .get().then(res => console.log("okok" + res.data.studentId))
            .then(res=>console.log("okok"+res.stats.updated))
        )
    })

}