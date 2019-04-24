// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
    return new Promise((resolve, reject) => {
        resolve(
            db.collection('courseList')
                .where({
                    isCheckOn:true,
                    checkOnCode: Number.parseInt(event.checkOnCode),
                })
                .get()
                // .get().then(res => console.log("okok" + res.data.studentId))
                .then(res =>{
                    console.log(res)
                    if (res.data.length==0){
                        return false
                    }else{
                        // 方法定义 lat,lng 
                        function GetDistance(lat1, lng1, lat2, lng2) {
                            var radLat1 = lat1 * Math.PI / 180.0;
                            var radLat2 = lat2 * Math.PI / 180.0;
                            var a = radLat1 - radLat2;
                            var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
                            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                            s = s * 6378.137;// 地球半径;
                            s = Math.round(s * 10000) / 10000;
                            return s;
                        }
                        // 调用 return的距离单位为km
                        var distance = GetDistance(res.data[0].latitude, res.data[0].longitude, event.latitude, event.longitude)*1000;
                        console.log("距离"+distance)
                        if(distance>res.data[0].distance){
                            加入异常名单
                        }else{
                            加入考勤人员名单
                        }

                        return true
                    }
                })
        )
    })
}