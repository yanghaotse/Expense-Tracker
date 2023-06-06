const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const moment = require('moment')

const RecordModel = require('./models/record')
const CategoryModel = require('./models/category')
const usePassport = require('./config/passport')

const routes = require('./routes')
require('./config/mongoose') // mongoDB

const app = express()
const port = 3000


//express-handlebars
app.engine('hbs', exphbs({ defaultLayout : 'main', extname: '.hbs'}))
app.set('view engine', 'hbs') 

// express-session
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// body-parser
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))
app.use(methodOverride('_method'))

usePassport(app)

// middleware
app.use((req, res, next) => {
  // 把 req.isAuthenticated() 回傳的布林值，交接給 res 使用
  res.locals.isAuthenticated = req.isAuthenticated()
  // 把使用者資料交接給 res 使用
  res.locals.user = req.user
  next()
})


app.use(routes)



app.listen( port, () => {
  console.log(`App is running on http://localhost:${port}`)
})





