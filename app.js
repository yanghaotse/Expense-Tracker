const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const RecordModel = require('./models/record')
const CategoryModel = require('./models/category')
// const {authenticator} = require('./middleware/auth')

const app = express()
const port = 3000

//express-handlebars
app.engine('hbs', exphbs({ defaultLayout : 'main', extname: '.hbs'}))
app.set('view engine', 'hbs') 

// body-parser
app.use(express.urlencoded({extended: true}))

//middleware


// mongoDB
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true,  useNewUrlParser: true, useCreateIndex: true})

const db = mongoose.connection
db.on('error', () => {
  console.log('mongoDB error')
})
db.once('open', () => {
  console.log('mongoDB connected!')
})

app.use(express.static('public'))




app.get('/',async (req, res) => {
  try{
    const records = await RecordModel.find().populate('categoryId').lean()
    const data = records.map(record => {
      const {name, date, amount} = record
      return{
        name,
        date,
        amount,
        icon: record.categoryId.icon
      }
    })
    // console.log(data) //檢查用
    res.render('index', {records: data})
  }catch(err){
    console.log(err)
  }
})


app.get('/record/new',(req, res) => {
  res.render('new')
})

app.get('/record/edit',(req, res) => {
  res.render('edit')
})

app.post('/record/new', async(req, res) => {
  const {name, date, category, amount} = req.body
  // console.log(name,date, category, amount) //檢查用
  const categoryData = await CategoryModel.findOne( {name: category}).lean()
  try{
    await RecordModel.create({
      name,
      date,
      amount,
      categoryId: categoryData._id
    })
    res.redirect('/')
  }catch(err){
    console.log(err)
  }
  
})


app.listen( port, () => {
  console.log(`App is running on http://localhost:${port}`)
})