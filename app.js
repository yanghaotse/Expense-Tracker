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



// 首頁
app.get('/', async (req, res) => {
  try{
    const records = await RecordModel.find().populate('categoryId').lean()
    const data = records.map(record => {
      const {_id, name, date, amount} = record
      return{
        _id,
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


app.get('/records/new',(req, res) => {
  res.render('new')
})

//編輯一筆資料GET
app.get('/records/edit/:_id',async (req, res) => {
  const _id = req.params._id
  // console.log(id) //檢查用
  try{
    const record = await RecordModel.findOne({ _id }).populate('categoryId').lean()
    res.render('edit', { record })
    // console.log(records.categoryId.name)
  }catch(err){
    console.log(err)
  }
})


// 編輯一筆資料POST
app.post('/records/edit/:_id', async(req, res) => {
  const _id = req.params._id
  const  {name, date, category, amount} = req.body
  try{
    // 抓取RecordModel資料若後面有家lean()，之後在儲存資料.save()時會因為資料格式問題無法儲存
    // const record = await RecordModel.findOne({ _id }).lean()
    const categoryData = await CategoryModel.findOne({ name : category}).lean()
    const record = {
      name,
      date,
      amount,
      categoryId: categoryData._id
    }
    
    await RecordModel.updateOne({ _id }, { $set: record})
    res.redirect('/')
  }catch(err){
    console.log(err)
  }
})

// 新增一筆資料
app.post('/records/new', async(req, res) => {
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