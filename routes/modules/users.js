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
  res.redirect('/users/login')
})

module.exports = router