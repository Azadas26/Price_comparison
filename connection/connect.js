var mongoClient = require('mongodb').MongoClient
var Promise = require('promise')

var state=
{
    db:null,
}

module.exports=
{
    connect_db:()=>
    {
        return new Promise((resolve,reject)=>
        {
            var dbname="Price_compair"
            mongoClient.connect("mongodb://127.0.0.1", { useNewUrlParser: true, useUnifiedTopology: true },(err,data)=>
            {
                if(err)
                {
                    reject(err)
                }
                else
                {
                    state.db=data.db(dbname)
                    resolve("Database connection success full...")
                }
            })
        })
    },
    get:()=>
    {
        return state.db;
    }
}

