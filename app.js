const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')

const usePassport = require('./config/passport')
const routes = require('./routes')
require('./config/mongoose') // mongoDB

const app = express()
const PORT = process.env.PORT || 3000


//express-handlebars
app.engine('hbs', exphbs({ defaultLayout : 'main', extname: '.hbs'}))
app.set('view engine', 'hbs') 

// express-session

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// body-parser
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))
app.use(methodOverride('_method'))

usePassport(app)

app.use(flash())
// middleware
app.use((req, res, next) => {
  // 把 req.isAuthenticated() 回傳的布林值，交接給 res 使用
  res.locals.isAuthenticated = req.isAuthenticated()
  // 把使用者資料交接給 res 使用
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})


app.use(routes)



app.listen( process.env.PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})





