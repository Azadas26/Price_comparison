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



router.get('/', function (req, res, next) {
  if (req.session.fuser) {
    res.render('./user/first-page', { user: true, Count: "0", fuser: req.session.fuser })
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
      console.log(state);
      req.session.fstatus = true;
      req.session.fuser = state.fuser;
      res.redirect('/')
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
  userbase.get_product_info_ptype(req.body).then(async(pro) => {
    console.log(pro);
    req.session.pro = pro
   await userbase.User_Search_history(req.body, req.session.fuser._id).then((data) => {

      res.redirect('/compair')
    })
  })
})

router.get('/moreinfo', this.fvarfylogin, (req, res) => {
  //console.log(req.query.id)
  userbase.Get_product_and_shope_info(req.query.id).then(async (proinfo) => {


    console.log(proinfo);
    res.render('./user/product&shope', { user: true, fuser: req.session.fuser, proInfo: proinfo })


    //console.log(proinfo)

  })
})
router.get('/removepro', (req, res) => {
  console.log(req.query.id)
  userbase.remove_carted_product(req.session.fuser._id, req.query.id).then((data) => {
    res.redirect('/intocart')
  })
})

router.get('/bookpro', this.fvarfylogin, (req, res) => {
  console.log(req.query);
  userbase.Place_Book_Products__By_Users(req.session.fuser._id, req.query.proid, req.query.shid).then((info) => {
    console.log(info);
    res.redirect('/viewbooks')
  })
})
router.get('/viewbooks', this.fvarfylogin, (req, res) => {
  userbase.view_User_Books(req.session.fuser._id).then((info) => {
    res.render('./user/view-orders', { user: true, fuser: req.session.fuser, info })
  })
})

module.exports = router;
