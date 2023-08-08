var Promise = require('promise')
var bcriypt = require('bcrypt')
var db = require('../connection/connect')
var consts = require('../connection/consts')
const async = require('hbs/lib/async')
const res = require('express/lib/response')
var objectId = require('mongodb').ObjectId


module.exports =
{
    Get_shope_all_products: () => {
        return new Promise(async (resolve, reject) => {
            var products = await db.get().collection(consts.shope_products).aggregate([
                {
                    $lookup:
                    {
                        from: consts.shope_base,
                        localField: 'shopid',
                        foreignField: '_id',
                        as: 'shop'
                    }
                },
                {
                    $project:
                    {
                        proinfo: 1,
                        shop:
                        {
                            $arrayElemAt: ['$shop', 0]
                        }
                    }
                }
            ]).toArray()
            // console.log(products)
            resolve(products)
        })
    },
    Delete_selled_products: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.shope_products).removeOne({ _id: objectId(Id) }).then((data) => {
                //console.log(data)
                resolve(data)
            })
        })
    },
    Info_about_shope_user: () => {
        return new Promise(async (resolve, reject) => {
            var suser = await db.get().collection(consts.shope_base).find().toArray()
            //console.log(suser)
            resolve(suser)
        })
    },
    Delete_shope_user: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.shope_base).removeOne({ _id: objectId(Id) }).then((data) => {
                // console.log(data)
                resolve(data)
            })
        })
    },
    Info_about_client_user: () => {
        return new Promise(async (resolve, reject) => {
            var cuser = await db.get().collection(consts.user_base).find().toArray()
            //console.log(cuser)
            resolve(cuser)
        })
    },
    Delete_client_user: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.user_base).removeOne({ _id: objectId(Id) }).then((data) => {
                //console.log(data)
                resolve(data)
            })
        })
    },
    Get_temp_shope_data: () => {
        return new Promise(async (resolve, reject) => {
            var shopeinfo = await db.get().collection(consts.Shope_tep_data).find().toArray()
            resolve(shopeinfo)
        })
    },
    Remove_shope_User_from_TEmp: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.Shope_tep_data).removeOne({ _id: objectId(Id) }).then((data) => {
                resolve(data)
            })
        })
    },
    remove_corresponting_shope_products: (Id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.shope_products).removeOne({ shopid: objectId(Id) }).then((data) => {
                resolve(data)
            })
        })
    },
    Do_Admin_Login: (info) => {
        return new Promise((resolve, reject) => {
            db.get().collection(consts.admin_Login).findOne({ namd: info.name }).then((username) => {
                console.log(username);
                if (username) {
                    if (username.password == info.password) {
                        username.status = true
                        resolve(username)
                        //console.log("Login successs");
                    }
                    else {
                        reject({ adminstatus: false })
                        // console.log("Login Faild");
                    }
                }
                else {
                    reject({ adminstatus: false })
                    // console.log("Login Faild");
                }
            })
        })
    },
    View_users_search_History: () => {
        return new Promise(async (resolve, reject) => {
            var info = await db.get().collection(consts.search_history).aggregate([
                {
                    $project:
                    {
                        _id: 1,
                        data: 1,
                        userid: 1
                    }
                },
                {

                    $lookup:
                    {
                        from: consts.user_base,
                        localField: "userid",
                        foreignField: "_id",
                        as: "user"
                    }

                },
                {
                    $project:
                    {
                        _id: 1,
                        data:1,
                        user:
                        {
                            $arrayElemAt: ['$user', 0]
                        }
                    }
                }
            ]).toArray()
            console.log(info);
            resolve(info)
        })
    }
}