const express = require('express')
const exphbs = require('express-handlebars')

const RecordModel = require('./models/record')
const CategoryModel = require('./models/category')
const moment = require('moment')
const methodOverride = require('method-override')
// const {authenticator} = require('./middleware/auth')
const routes = require('./routes')
require('./config/mongoose') // mongoDB

const app = express()
const port = 3000

//express-handlebars
app.engine('hbs', exphbs({ defaultLayout : 'main', extname: '.hbs'}))
app.set('view engine', 'hbs') 

// body-parser
app.use(express.urlencoded({extended: true}))

//middleware


app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(routes)



app.listen( port, () => {
  console.log(`App is running on http://localhost:${port}`)
})





