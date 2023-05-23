const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const RecordModel = require('./models/record')

const app = express()
const port = 3000

//express-handlebars
app.engine('hbs', exphbs({ defaultLayout : 'main', extname: '.hbs', useUnifiedTopology: true}))
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

app.use(express.static('public'))


app.get('/', (req, res) => {
  res.render('index')
})


app.get('/record/new',(req, res) => {
  res.render('new')
})

app.get('/record/edit',(req, res) => {
  res.render('edit')
})

// app.post('/record/new', (req, res) => {
//   const {name, date, category, amount} = req.body
// })


app.listen( port, () => {
  console.log(`App is running on http://localhost:${port}`)
})