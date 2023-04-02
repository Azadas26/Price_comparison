var express = require('express');
var router = express.Router();
var admindb = require('../database/admin-base')

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.adfaild) {
    res.render('./admin/first-page', { message: "Invalid Username or Password" });
    req.session.adfaild = false
  }
  else {
    res.render('./admin/first-page');
  }
});



router.post('/', (req, res) => {
  if (req.body.name === "admin") {
    if (req.body.password === "admin123") {
      admindb.Get_shope_all_products().then((products) => {
        res.render('./admin/list-products', { admin: true, pro: products })
      })
    }
    else {
      req.session.adfaild = true
      res.redirect('/admin')
    }
  }
  else {
    req.session.adfaild = true
    res.redirect('/admin')
  }
})

router.get('/delete', (req, res) => {
  admindb.Delete_selled_products(req.query.id).then((data) => {
    res.redirect('/admin/')
  })
})
router.get('/users', (req, res) => {
  admindb.Info_about_shope_user().then((suser) => {
    res.render('./admin/list-shope', { admin:true, users: suser })
  })
})

router.get('/sdelete', (req, res) => {
  //console.log(req.query.id)
  admindb.Delete_shope_user(req.query.id).then((data)=>
  {
     res.redirect('/admin/users')
  })
})

router.get('/cusers',(req,res)=>
{
  admindb.Info_about_client_user().then((cuser)=>
  {
    res.render('./admin/list-user', { admin: true ,users:cuser})
  })
})
router.get('/cdelete',(req,res)=>
{
   admindb.Delete_client_user(req.query.id).then((data)=>
   {
      res.redirect('/admin/cusers')
   })
})

module.exports = router;
