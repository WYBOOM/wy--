// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const courseList = db.collection('courseList')
    

// 方法定义 lat,lng 
function GetDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // 地球半径;
    s = Math.round(s * 10000) / 10000;
    return s;
}

exports.main = async(event, context) => {
    return new Promise((resolve, reject) => {
        resolve(
            
            courseList.where({
                isCheckOn: true,
                checkOnCode: Number.parseInt(event.checkOnCode),
                courseName: event.courseName,
            }).get()
            // .get().then(res => console.log("okok" + res.data.studentId))
            .then(res => {
                console.log(res)
                if (res.data.length == 0) {
                    return false
                } else {

                    // 调用 return的距离单位为km
                    var distance = GetDistance(res.data[0].latitude, res.data[0].longitude, event.latitude, event.longitude) * 1000;
                    console.log("距离" + distance)
                    if (distance > res.data[0].distance) {
                        //加入异常名单
                        console.log("加入异常");
                        return courseList.where({
                            isCheckOn: true,
                            checkOnCode: Number.parseInt(event.checkOnCode),
                            courseName: event.courseName,
                        })
                            .update({
                                data: {
                                    unusualPeopleList: _.push({
                                        name: event.studentName,
                                        studentId: event.studentId,
                                    }),
                                },
                        
                            })
                    } else {
                        //加入考勤人员名单
                       return courseList.where({
                            isCheckOn: true,
                            checkOnCode: Number.parseInt(event.checkOnCode),
                            courseName: event.courseName,
                        }).update({
                            data: {
                                checkOnPeopleList: _.push({
                                    name: event.studentName,
                                    studentId: event.studentId,
                                }),
                            }
                        })
                         
                    }


                    // // 调用 return的距离单位为km
                    // var distance = GetDistance(res.data[0].latitude, res.data[0].longitude, event.latitude, event.longitude) * 1000;
                    // console.log("距离" + distance)
                    // if (distance > res.data[0].distance) {
                    //     //加入异常名单
                    //     console.log("加入异常");
                    //     courseList.where({
                    //         isCheckOn: true,
                    //         checkOnCode: Number.parseInt(event.checkOnCode),
                    //         courseName: event.courseName,
                    //     })
                    //     .update({
                    //             data: {
                    //                 unusualPeopleList: _.push({
                    //                     name: event.studentName,
                    //                     studentId: event.studentId,
                    //                 }),
                    //             },
                    //             success(res){
                    //                 console.log("okok" + res);
                    //                 return true
                    //             }
                                
                    //         })
                    // } else {
                    //     //加入考勤人员名单
                    //     courseList.where({
                    //         isCheckOn: true,
                    //         checkOnCode: Number.parseInt(event.checkOnCode),
                    //         courseName: event.courseName,
                    //     }).update({
                    //             data: {
                    //                 checkOnPeopleList: _.push({
                    //                     name: event.studentName,
                    //                     studentId: event.studentId,
                    //                 }),
                    //             }
                    //         })
                    //         .then(res => {
                    //             console.log("okok" + res);
                    //             console.log("加入正常");
                    //             return true
                    //         })
                    // }


                }
                }).then(res => {
                    console.log("okok" + res);
                    return true
                })
        )
    })
}