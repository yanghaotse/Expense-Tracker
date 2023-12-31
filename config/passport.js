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
    // profileFields: ['email']
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    // console.log(profile._json) //測試用
    const {email, name} = profile._json
    UserModel.findOne({ email })
      .then( user => {
        if(user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then( salt => bcrypt.hash( randomPassword, salt))
          .then( hash => UserModel.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))

      })


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
