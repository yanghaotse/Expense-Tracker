const express = require('express')
const router = express.Router()
const UserModel = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect:'/',
  failureRedirect: 'users/login'
}))

router.get('/register', (req,res) => {
  res.render('register')
})

router.post('/register', async(req,res) => {
  const {name, email, password, confirmPassword} = req.body
  const errors = []
  if(!name || !email || !password || !confirmPassword){
    errors.push({message: '所有欄位都是必填!'})
  } 
  if(password !== confirmPassword){
    errors.push({message: '密碼與確認密碼不符!'})
  }
  if(errors.length){
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  try{
    const users = await UserModel.findOne({ email }).lean()
    if(users){
      console.log('User already exist.')
      res.render('register', {name, email, password, confirmPassword})
    }else{
       await UserModel.create({
        name,
        email,
        password,
      })
    }
    res.redirect('/')
  }catch(err){
    console.log(err)
  }
  
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已成功登出。')
  res.redirect('/users/login')
})

module.exports = router