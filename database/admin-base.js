var Promise = require('promise')
var bcriypt = require('bcrypt')
var db = require('../connection/connect')
var consts = require('../connection/consts')
const async = require('hbs/lib/async')
const res = require('express/lib/response')
var objectId = require('mongodb').ObjectId


module.exports=
{
    Get_shope_all_products:()=>
    {
        return new Promise(async(resolve,reject)=>
        {
            var products=await db.get().collection(consts.shope_products).find().toArray()
             //console.log(products)
             resolve(products)
        })
    },
    Delete_selled_products:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.shope_products).removeOne({_id:objectId(Id)}).then((data)=>
            {
                //console.log(data)
                resolve(data)
            })
        })
    },
    Info_about_shope_user:()=>
    {
        return new Promise(async(resolve,reject)=>
        {
           var suser= await db.get().collection(consts.shope_base).find().toArray()
           //console.log(suser)
           resolve(suser)
        })
    },
    Delete_shope_user:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.shope_base).removeOne({_id:objectId(Id)}).then((data)=>
            {
               // console.log(data)
               resolve(data)
            })
        })
    },
    Info_about_client_user:()=>
    {
        return new Promise(async(resolve,reject)=>
        {
                var cuser=await db.get().collection(consts.user_base).find().toArray()
                //console.log(cuser)
                resolve(cuser)
        })
    },
    Delete_client_user:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.user_base).removeOne({_id:objectId(Id)}).then((data)=>
            {
                //console.log(data)
                resolve(data)
            })
        })
    }
}