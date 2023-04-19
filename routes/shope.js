const e = require('express');
var express = require('express');
var router = express.Router();
var shopebase = require('../database/shope-base')


module.exports.verfylogin = function (req, res, next) {
    if (req.session.user) {
        next()
    }
    else {
        res.redirect('/shope/login')
    }
}


/* GET home page. */

router.get('/',(req,res)=>
{
     res.render('./shope/first-page')
})

router.get('/intro', this.verfylogin, function (req, res, next) {

    if (req.session.user) {
        console.log(req.session.user)
        res.render('./shope/add-products', { shope: true, users: req.session.user })

    }
    else {
        res.render('./shope/add-products', { shope: true })
    }

});

router.get('/signup', (req, res) => {

    res.render('./shope/signup-page', { shope: true })
})

router.post('/signup', (req, res) => {
        console.log(req.body);
      shopebase.Do_Temp_shope_siGnup(req.body).then((data)=>
      {
          res.redirect('/shope/signup')
      })

})

router.get('/login', (req, res) => {
    if (req.session.faild) {
        res.render('./shope/login-page', { shope: true, message: "Invaled Username or Password" })
        req.session.faild = false
    }
    else {
        res.render('./shope/login-page', { shope: true })
    }
})

router.post('/login', (req, res) => {
    // console.log(req.body)
    shopebase.Do_Login(req.body).then((data) => {
        if (data.status) {
            req.session.status = true;
            req.session.user = data.user
            res.redirect('/shope/intro')
        }
        else {
            req.session.faild = true;
            res.redirect('/shope/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/shope/login')
})

router.post('/add', this.verfylogin, (req, res) => {
    var shopeId = req.session.user._id
    //  console.log(shopeId)
    shopebase.ADD_shope_products(req.body, shopeId).then((id) => {
        if (req.files.pimage) {
            var image = req.files.pimage
            image.mv("public/shope-image/" + id + ".png", (err, donr) => {
                if (err) {
                    console.log(err)
                }
            })

        }
        res.redirect('/shope/intro')
    })
})

router.get('/listpro', this.verfylogin, (req, res) => {

    shopebase.Get_added_products(req.session.user._id).then((products) => {
        res.render('./shope/list-product', { shope: true, users: req.session.user, products })
    })
})

router.get('/deletepro', (req, res) => {
    console.log(req.query.id)
    shopebase.Delete_Shope_products(req.query.id).then((data) => {
        res.redirect('/shope/listpro')
    })
})
router.get('/editpro', this.verfylogin, (req, res) => {
    shopebase.Get_product_fr_edit(req.query.id).then((product) => {
        res.render('./shope/edit-page', { shope: true, product })
    })
})

router.post('/upedit', (req, res) => {
    shopebase.Put_edited_products(req.body, req.query.id).then((data) => {
        res.redirect('/shope/listpro')
    })
})


module.exports = router;
