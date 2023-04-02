const e = require('express');
var express = require('express');
var router = express.Router();
var userbase = require('../database/user-base');
const async = require('hbs/lib/async');
const res = require('express/lib/response');

module.exports.fvarfylogin = (req, res, next) => {
  if (req.session.fuser) {
    next()
  }
  else {
    res.redirect('/login')
  }
}
/* GET users listing. */
router.get('/', (req, res) => {
  res.render('./user/intro-page')
})


router.get('/intro', function (req, res, next) {
  if (req.session.fstatus) {
    userbase.Cart_count(req.session.fuser._id).then((count) => {
      res.render('./user/first-page', { user: true, fuser: req.session.fuser, Count: count })
    })

  }
  else {
    res.render('./user/first-page', { user: true, Count: "0" })
  }
});

router.get('/signup', (req, res) => {

  res.render('./user/signup-page', { user: true })
})

router.post('/signup', (req, res) => {
  //console.log(req.body)
  userbase.Do_signup(req.body).then((data) => {
    res.redirect('/signup')
  })
})

router.get('/login', (req, res) => {
  if (req.session.ffaild) {
    res.render('./user/login-page', { user: true, fmessage: "Invalid Username or Password..." })
    req.session.ffaild = false;
  }
  else {
    res.render('./user/login-page', { user: true })
  }
})

router.post('/login', (req, res) => {
  //console.log(req.body)
  userbase.Do_login(req.body).then((state) => {
    if (state.status) {
      req.session.fstatus = true;
      req.session.fuser = state.fuser;
      res.redirect('/intro')
    }
    else {
      req.session.ffaild = true
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

router.get('/compair', this.fvarfylogin, (req, res) => {
  if (req.session.pro) {
    res.render('./user/compair-page', { user: true, fuser: req.session.fuser, pro: req.session.pro })
  }
  else {
    res.render('./user/compair-page', { user: true, fuser: req.session.fuser })
  }
})

router.post('/compair', (req, res) => {
  //console.log(req.body)
  userbase.get_product_info_ptype(req.body).then((pro) => {
    req.session.pro = pro
    res.redirect('/compair')
  })
})

router.get('/moreinfo', (req, res) => {
  //console.log(req.query.id)
  userbase.Get_product_and_shope_info(req.query.id).then(async (proinfo) => {
    await userbase.Cart_count(req.session.fuser._id).then((count) => {


      res.render('./user/product&shope', { user: true, fuser: req.session.fuser, proInfo: proinfo, Count: count })

    })
    //console.log(proinfo)

  })
})
router.get('/cart', (req, res) => {
  //console.log(req.query.id)
  // console.log("Azad Here")
  userbase.Cart_clicked(req.session.fuser._id, req.query.id).then((data) => {
    //res.redirect('/compair')
    res.json({ status: true })
  })
})

router.get('/intocart', this.fvarfylogin, (req, res) => {
  userbase.Cart_count(req.session.fuser._id).then((count)=>
  {
     if(count!=0)
     {
       userbase.view_carted_products(req.session.fuser._id).then((products) => {
         res.render('./user/cart-page', { user: true, fuser: req.session.fuser, pro: products })
       })
     }
     else
     {
       res.render('./user/cart-page', { user: true, fuser: req.session.fuser})
     }
  })
})
router.get('/removepro', (req, res) => {
  console.log(req.query.id)
  userbase.remove_carted_product(req.session.fuser._id, req.query.id).then((data) => {
    res.redirect('/intocart')
  })
})
router.get('/buy', (req, res) => {

})

module.exports = router;
