const express = require('express')
const router = express.Router()
const userModel = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req,res) => {
  
})

router.get('/register', (req,res) => {
  res.render('register')
})

router.post('/register', async(req,res) => {
  const {name, email, password, confirmPassword} = req.body
  try{
    const users = await userModel.findOne({ email }).lean()
    if(users){
      console.log('User already exist.')
      res.render('register', {name, email, password, confirmPassword})
    }else{
       await userModel.create({
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

module.exports = router