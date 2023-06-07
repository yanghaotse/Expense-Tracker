const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy 
const UserModel = require('../models/user')


module.exports = app => {
  // 初始化passport模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email'}, async (email, password, done) => {
    // { usernameField: 'email'} --> 將原本預設驗證項目從`username`改為`email`
    try{
      const user = await UserModel.findOne({ email })
      if(!user){
        return done(null, false, { message: 'This email is not registered!'})
      }
      if( user.password !== password){
        return done(null, false, { message: 'Email or Password incorrect!'})
      }
      return done(null, user)
    }catch(err){
      console.log(err)
    }
  }))
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    await UserModel.findById(id)
      .lean()
      .then( user => done(null, user))
      .catch(err => done(err, null))
    // try{
    //   const user = await UserModel.findById(id)
    //   done(null, user)
    // }catch(err){
    //   done(err, null)
    // }
  })
  
}