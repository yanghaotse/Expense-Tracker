const express = require('express')
const router = express.Router()
const passport = require('passport')

// 向facebook發出請求
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// 接收facebook傳回的資料 ，路由在passport.js中設定的 callbackURL:http://localhost:3000/auth/facebook/callback
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect:'/',
  failureRedirect: '/users/login'
}))

module.exports = router