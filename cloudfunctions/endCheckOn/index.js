// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async(event, context) => {
    return new Promise((resolve, reject) => {
        var unusualPeopleList;
        var index;
        var teacherList;
        resolve(
            db.collection('courseList')
            .where({
                courseName: event.courseName,
            }).get().then(res => {

                unusualPeopleList = res.data[0].unusualPeopleList;

                return db.collection('teacherList')
                    .where({
                        accountNum: event.accountNum,
                    }).get()
            }).then(res => {

                teacherList = res.data[0];
                teacherList.createdCourse.forEach((item, i) => {

                    if (item.className == event.className && item.courseName == event.courseName) {

                        teacherList.createdCourse[i].historyCheckOn.push({
                            checkOnClassName: event.className,
                            checkOnTime: new Date(),
                            unusualPeopleList: unusualPeopleList
                        })
                        index = i;
                    }
                })
                return db.collection('teacherList')
                    .where({
                        accountNum: event.accountNum,
                    })
                    .update({
                        data: {
                            createdCourse: teacherList.createdCourse
                        }
                    })
            }).then(res => {
                return db.collection('courseList')
                    .where({
                        courseName: event.courseName,
                    })
                    .update({
                        data: {
                            isCheckOn: false,
                            checkOnPeopleList: [],
                            checkOnCode: 1111,
                            distance: 20,

                        }
                    })
            })
            .then(res => {
                console.log(res)
            })


        )
    })
}