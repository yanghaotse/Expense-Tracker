const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const app = express()
const port = 3000

//express-handlebars
app.engine('hbs', exphbs({ defaultLayout : 'main', extname: '.hbs'}))
app.set('view engine', 'hbs') 

// body-parser
app.use(express.urlencoded({extended: true}))

// mongoDB
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection
db.on('error', () => {
  console.log('mongoDB error')
})
db.once('open', () => {
  console.log('mongoDB connected!')
})



app.get('/', (req, res) => {
  res.render('index')
})

app.listen( port, () => {
  console.log(`App is running on http://localhost:${port}`)
})