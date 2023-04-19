var bcrypt = require('bcrypt')
const { resolve, reject } = require('promise')
var Promise = require('promise')
var db = require('../connection/connect')
var consts = require('../connection/consts')
var objectId = require('mongodb').ObjectId

module.exports=
{
    Do_Temp_shope_siGnup:(data)=>
    {
        return new Promise((resolve,reject)=>
        {
            db.get().collection(consts.Shope_tep_data).insertOne(data).then((data)=>
            {
                resolve(data)
            })
        })
    },
    Do_signup:(data)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            data.spassword = await bcrypt.hash(data.spassword,10)
            //console.log(data.spassword)
            db.get().collection(consts.shope_base).insertOne(data).then((data)=>
            {
                //console.log(data)
                resolve(data.ops[0]._id)
            })
        })
    },
    Do_Login:(datas)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.shope_base).findOne({semail:datas.semail}).then((details)=>
            {
                if(details)
                {
                       bcrypt.compare(datas.spassword,details.spassword).then((data)=>
                       {
                           var state =
                           {
                               status: true,
                               user: details
                           }
                        
                         if(data)
                         {
                             
                             console.log("LOgin successfull...")
                              resolve(state)
                         }
                         else
                         {
                             console.log("LOgin faild...")
                             resolve({status:false})
                         }
                       })
                }
                else
                {
                    console.log("Invalid Email Address....")
                    resolve({ status: false })
                }
            })
        })
    },
    ADD_shope_products:(data,shopeId)=>
    {
        return new Promise((resolve,reject)=>
        {
            var products=
            {
                shopid : objectId(shopeId),
                proinfo : data
            }
            db.get().collection(consts.shope_products).insertOne(products).then((data)=>
            {
                //console.log(data)
                resolve(data.ops[0]._id)
            })
        })
    },
    Get_added_products:(shopeId)=>
    {
        return new Promise(async(resolve,reject)=>
        {
          var products=  await db.get().collection(consts.shope_products).find({shopid:objectId(shopeId)}).toArray()
         // console.log(products)
         resolve(products)
        })
    },
    Delete_Shope_products:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            
            await db.get().collection(consts.shope_products).removeOne({_id:objectId(Id)}).then((data)=>
            {
                console.log(data)
                resolve(data)
            })
        })
    },
    Get_product_fr_edit:(Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.shope_products).findOne({_id:objectId(Id)}).then((data)=>
            {
               // console.log(data)
               resolve(data)
            })
        })
    },
    Put_edited_products:(data,Id)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(consts.shope_products).updateOne({_id:objectId(Id)},
            {
                $set:
                {
                    "proinfo.pname":data.pname,
                    "proinfo.ptype":data.ptype,
                    "proinfo.pbrand":data.pbrand,
                    "proinfo.mnumber":data.mnumber,
                    "proinfo.wyear":data.wyear,
                    "proinfo.pprice":data.pprice
                }
            }).then((data)=>
            {
               // console.log(data)
               resolve(data)
            })
        })
    }
}