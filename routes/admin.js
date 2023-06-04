var express = require('express');
var router = express.Router();
var admindb = require('../database/admin-base')
var shopedb = require('../database/shope-base');
const async = require('hbs/lib/async');

const verfyadmin = (req, res, next) => {
  if (req.session.adminstatus) {
    next()
  }
  else {
    res.redirect('/admin')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.adfaild) {
    res.render('./admin/login-page', { message: "Invalid Username or Password" });
    req.session.adfaild = false
  }
  else {
    res.render('./admin/login-page');
  }
});

router.post('/', (req, res) => {
  admindb.Do_Admin_Login(req.body).then((info) => {
    console.log(info);
    if (info.status) {
      req.session.admin = info.namd;
      req.session.adminstatus = true
      res.redirect('/admin/users')
    } else {
      req.session.adfaild = true;
      res.redirect('/')
    }
  })
})
router.get('/proinfo',verfyadmin, (req, res) => {
  console.log("Hiii");
  admindb.Get_shope_all_products().then((products) => {
    console.log(products);
    res.render('./admin/list-products', { admin: true,  pro:products })
  }) 
})

router.get('/delete', (req, res) => {
  admindb.Delete_selled_products(req.query.id).then((data) => {
    res.redirect('/admin/')
  })
})
router.get('/users',verfyadmin, (req, res) => {
  admindb.Info_about_shope_user().then((suser) => {
    console.log(suser);
    res.render('./admin/list-shope', { admin: true, users: suser })
  })
})

router.get('/sdelete', async (req, res) => {
  //console.log(req.query.id)
  await admindb.Delete_shope_user(req.query.id).then((data) => {
    if (data) {
      admindb.remove_corresponting_shope_products(req.query.id).then((da) => {
        res.redirect('/admin/users')
      })
    }
  })


})

router.get('/cusers', (req, res) => {
  admindb.Info_about_client_user().then((cuser) => {
    res.render('./admin/list-user', { admin: true, users: cuser })
  })
})
router.get('/cdelete', (req, res) => {
  admindb.Delete_client_user(req.query.id).then((data) => {
    res.redirect('/admin/cusers')
  })
})

router.get('/accept', (req, res) => {
  admindb.Get_temp_shope_data().then((data) => {
    res.render('./admin/accept-shope', { admin: true, sp: data })
  })
})

router.post('/shopesignup', async (req, res) => {
  await shopedb.Do_signup(req.body).then((Id) => {
    admindb.Remove_shope_User_from_TEmp(req.query.id).then((da) => {
      res.redirect('/admin/accept')
    })
  })
})

router.get('/removerequest', (req, res) => {
  admindb.Remove_shope_User_from_TEmp(req.query.id).then((data) => {
    res.redirect('/admin/accept')
  })
})

module.exports = router;
