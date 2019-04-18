// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    return new Promise((resolve, reject) => {
        resolve(
            db.collection('courseList')
            .where({
                className:event.className,
                courseName:event.courseName,
            })
                .update({
                    data: {
                        checkOnCode: event.checkOnCode,
                        distance: event.distance,
                        latitude: event.latitude,
                        longitude: event.longitude,
                        isCheckOn:true
                    }
                })
                // .get().then(res => console.log("okok" + res.data.studentId))
                .then(res => console.log("okok" + res.stats.updated))
        )
    })
}