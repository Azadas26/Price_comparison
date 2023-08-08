var Promise = require('promise')
var bcriypt = require('bcrypt')
var db = require('../connection/connect')
var consts = require('../connection/consts')
const { resolve, reject } = require('promise')
const async = require('hbs/lib/async')
var objectId = require('mongodb').ObjectId

module.exports =
{
    Do_signup: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcriypt.hash(data.password, 10);
            db.get().collection(consts.user_base).insertOne(data).then((data) => {
                //console.log(data)
                resolve(data)
            })
        })
    },
    Do_login: (data) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(consts.user_base).findOne({ email: data.email }).then(async (email) => {
                if (email) {
                    await bcriypt.compare(data.password, email.password).then((data) => {

                        if (data) {
                            var state =
                            {
                                status: true,
                                fuser: email
                            }
                            resolve(state)
                        }
                        else {
                            resolve({ status: false })
                        }
                    })
                }
                else {
                    resolve({ status: false })
                }
            })
        })
    },
    get_product_info_ptype: (data) => {
        return new Promise(async (resolve, reject) => {
            console.log(data.mnumber)
            var pro = await db.get().collection(consts.shope_products).find({ "proinfo.mnumber": data.mnumber }).toArray()
            console.log(pro)
            //  console.log(max)
            resolve(pro)
        })
    },
    Get_product_and_shope_info: (id) => {
        return new Promise(async (resolve, reject) => {
            var pro = await db.get().collection(consts.shope_products).aggregate([
                {
                    $match:
                    {
                        _id: objectId(id)
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.shope_base,
                        localField: "shopid",
                        foreignField: "_id",
                        as: "allinfo"
                    }
                }
            ]).toArray()
            //console.log(pro[0].allinfo[0])
            var product = {
                pro: pro[0],
                shope: pro[0].allinfo[0]
            }

            console.log(pro)
            resolve(product)
        })
    },
    Place_Book_Products__By_Users: (userId, proId, shId) => {
        return new Promise((reslove, reject) => {
            var state =
            {
                UserId: objectId(userId),
                ProId: objectId(proId),
                ShopId: objectId(shId)
            }
            db.get().collection(consts.user_books).insertOne({ ...state }).then((data) => {
                reslove(data)
            })
        })
    },
    view_User_Books: (userId) => {
        return new Promise(async (resolve, reject) => {
            var info = await db.get().collection(consts.user_books).aggregate([
                {
                    $match:
                    {
                        UserId: objectId(userId)
                    }
                },
                {
                    $project:
                    {
                        _id: 1,
                        UserId: 1,
                        ProId: 1,
                        ShopId: 1
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.shope_products,
                        localField: "ProId",
                        foreignField: "_id",
                        as: "pro"
                    }
                },
                {
                    $project:
                    {
                        _id: 1,
                        UserId: 1,
                        ProId: 1,
                        ShopId: 1,
                        products:
                        {
                            $arrayElemAt: ['$pro', 0]
                        }
                    }
                },
                {
                    $lookup:
                    {
                        from: consts.shope_base,
                        localField: "ShopId",
                        foreignField: "_id",
                        as: "shop"
                    }
                },
                {
                    $project:
                    {
                        _id: 1,
                        UserId: 1,
                        ProId: 1,
                        ShopId: 1,
                        products: 1,
                        shop:
                        {
                            $arrayElemAt: ['$shop', 0]
                        }
                    }
                },

            ]).toArray()
            console.log(info[0]);
            resolve(info)
        })
    },
    User_Search_history: (data,userId) => {
        return new Promise((resolve,reject)=>
        {
            var state=
            {
                data,
                userid:objectId(userId)
            }
            db.get().collection(consts.search_history).insertOne({...state}).then((data)=>
            {
                resolve(data)
            })
        })
    }

}
