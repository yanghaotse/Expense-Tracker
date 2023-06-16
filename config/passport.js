const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy 
const FacebookStrategy = require('passport-facebook').Strategy
const UserModel = require('../Models/user')
const bcrypt= require('bcryptjs')
module.exports = app => {
  // 初始化passport模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email'}, async(email, password, done) => {
    // { usernameField: 'email'} --> 將原本預設驗證項目從`username`改為`email`
    UserModel.findOne({ email }) 
    .then(user => {
      if(!user){
        return done(null, false, { type: 'warning_msg', message: 'That email is not registered!'})
      }
      return bcrypt.compare(password, user.password).then( isMatch => {
        if(!isMatch){
          return done(null, false, { type: 'warning_msg', message: 'Email or Password incorrect.'})
        }
        return done(null, user)
      })
    })
    .catch (err => done(err, false))
    // try{
    //   const user = await UserModel.findOne({ email }).lean()
    //   if(!user){
    //     return done(null, false, { type: 'warning_msg', message: 'That email is mot registered!'})
    //   }
    //   const comparePassword = await bcrypt.compare(password, user.password)
    //   if( !comparePassword){
    //     return done(null, false, { type: 'warning_msg', message: 'Email or Password incorrect.'})
    //   }
    //   return done(null, user)
    // }catch(err){
    //   console.log(err)
    // }
  }))
  // 設定facebook登入策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName'],
  }, async (accessToken, refreshToken, profile, done) => {
    // console.log(profile._json) //測試用
    const {email, name} = await profile._json
    try{
      // 判斷使用者是否已存在
      const existUser = await UserModel.findOne({ email }).lean()
      if(existUser) return done(null, existUser)
      // 若沒有則新增
      const randomPassword = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash( randomPassword, salt)
      const user = await UserModel.create({
        name,
        email,
        password: hash
      })
      done(null, user)
    }catch(err){
      done(null, false)
    }

  }))
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try{
      const user = await UserModel.findById(id).lean()
      done(null, user)
    }catch(err){
      done(err, null)
    }
  })
}