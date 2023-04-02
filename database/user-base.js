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
            // console.log(pro)
            resolve(pro)
        })
    },
    Get_product_and_shope_info: (id) => {
        return new Promise(async (resolve, reject) => {
            var pro = await db.get().collection(consts.shope_products).aggregate([
                {
                   $match:
                   {
                      _id:objectId(id)
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
            var product={
                pro:pro[0],
                shope: pro[0].allinfo[0]
            }

            //console.log(product)
            resolve(product)
        })
    },
    Cart_clicked:(userId,proId)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            var cart = await db.get().collection(consts.cart_base).findOne({user_id:objectId(userId)})
            if(cart)
            {
                db.get().collection(consts.cart_base).updateOne({user_id:objectId(userId)},
                {
                    $push:{
                        products:objectId(proId)
                    }
                }).then((data)=>
                {
                    resolve(data)
                })
            }
            else
            {
                var state=
                {
                    user_id:objectId(userId),
                    products:[objectId(proId)]
                }
                db.get().collection(consts.cart_base).insertOne(state).then((data)=>
                {
                        //console.log(data)
                        resolve(data)
                })
            }
        })
    },
    Cart_count:(userId)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            var count=await db.get().collection(consts.cart_base).findOne({user_id:objectId(userId)})
            if(count)
            {
               var c = count.products.length;
              // console.log(c)
              resolve(c)
            }
            else
            {
                resolve("0")
            }
        })
    },
    view_carted_products:(userId)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            var cart=await db.get().collection(consts.cart_base).aggregate([
                {
                    $match:
                    {
                        user_id:objectId(userId)
                    }
                },
                {
                    $lookup:
                    {
                            from:consts.shope_products,
                            let:{proList:'$products'},
                            pipeline:[
                                {
                                    $match:
                                    {
                                        $expr:
                                        {
                                            $in:['$_id','$$proList']
                                        }
                                    }
                                }
                            ],
                            as:'cartList'
                    }
                }
            ]).toArray()
           // console.log(cart[0].cartList)
            resolve(cart[0].cartList)
        })
    },
    remove_carted_product:(userId,proId)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.cart_base).updateOne({user_id:objectId(userId)},
            {
                $pull:
                {
                    products:objectId(proId)
                }
            }).then((data)=>
            {
                //console.log(data)
                resolve(data)
            })
        })
    }
}
