const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const RecordModel = require('./models/record')
const CategoryModel = require('./models/category')
const moment = require('moment')
const methodOverride = require('method-override')
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
app.use(methodOverride('_method'))


// 首頁
app.get('/', async (req, res) => {
  try{
    const records = await RecordModel.find().populate('categoryId').lean()
    const data = records.map(record => {
      const {_id, name, date, amount} = record
      // console.log(date) //檢查用
      //output:
      // 2019-04-22T16:00:00.000Z
      // 2019-04-22T16:00:00.000Z
      // 2019-04-22T16:00:00.000Z
      // 2015-03-31T16:00:00.000Z
      const formatDate = moment.utc(date).format('YYYY/MM/DD')
      return{
        _id,
        name,
        date: formatDate,
        amount,
        icon: record.categoryId.icon
      }
    })
    // console.log(data) //檢查用

    // 計算總金額
    const totalAmount = data.reduce(((accumulator, item) => {
      return accumulator + item.amount
    }), 0)
    // console.log(totalAmount) 檢查用
    
    res.render('index', { records: data , totalAmount})
  }catch(err){
    console.log(err)
  }
})


// route: POST/sort
// app.post('/records/sort', async (req, res) => {
//   const query = req.query.sort
//   console.log(query)
//   const sort = req.body.sort
//   // console.log(sort)
//   try{
//     const categoryData = await CategoryModel.findOne({ name: sort}).lean()
//     const records = await RecordModel.find( {categoryId: categoryData._id} ).populate('categoryId').lean()
//     // console.log(records)r檢查用
//     const data = records.map( record => {
//       const {_id, name, date, amount,} = record
//       const formatDate = moment.utc(date).format('YYYY/MM/DD')
//       return {
//         _id,
//         name,
//         date: formatDate,
//         amount,
//         icon: record.categoryId.icon
//       }
//     })
//     res.render('sort', {records: data, sort})

//   }catch(err){
//     console.log(err)
//   }
// })

// route: GET/sort
app.get('/records/sort', async(req, res) => {
  const sort = req.query.sort
  try{
    const sort = req.query.sort
    console.log(sort)
    // res.render('sort')
    const categoryDate = await CategoryModel.findOne({ name: sort}).lean()
    const records = await RecordModel.find({ categoryId: categoryDate._id}).populate('categoryId').lean()
    const data = records.map(record => {
      const {_id, name, date, amount} = record
      const formatDate = moment.utc(date).format('YYYY/MM/DD')
      return {
        _id,
        name,
        date: formatDate,
        amount,
        icon: record.categoryId.icon
      }
    })
    const totalAmount = data.reduce(((accumulator, item) => {
      return accumulator + item.amount
    }),0 )
    res.render('sort', {records: data, sort, totalAmount})
  }catch(err){
    console.log(err)
  }
})


// route: GET/new
app.get('/records/new',(req, res) => {
  res.render('new')
})

// route: GET/edit
app.get('/records/edit/:_id',async (req, res) => {
  const _id = req.params._id
  // console.log(id) //檢查用
  try{
    const record = await RecordModel.findOne({ _id }).populate('categoryId').lean()
    const formatDate = moment.utc(record.date).format('YYYY-MM-DD') // 若設定為YYYY/MM/DD也會無法轉換
    // console.log(record.date, formatDate) 檢查用

    res.render('edit', { record, formatDate })
    // console.log(records.categoryId.name)
  }catch(err){
    console.log(err)
  }
})


// route: POST/edit
app.put('/records/edit/:_id', async(req, res) => {
  const _id = req.params._id
  const  {name, date, category, amount} = req.body
  try{
    // const record = await RecordModel.findOne({ _id }).lean()
    // 抓取RecordModel資料若後面有家lean()，之後用.save()儲存資料時會因為資料格式問題無法儲存，故改用.updateOne
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

// route: POST/new
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

// route: POST/delete
app.delete('/records/delete/:_id', async(req, res) => {
  const _id = req.params._id
  try{
    await RecordModel.findByIdAndDelete(_id)
    res.redirect('/')
  }catch(err){
    console.log(err)
  }
})


app.listen( port, () => {
  console.log(`App is running on http://localhost:${port}`)
})



// 問題紀錄
// 在首頁路由中 轉換date格式為:" YYYY/MM/DD"，原本格式: "2019-04-22T16:00:00.000Z"
// 使用javascript語法，問題: 顯示的日期比資料日期多一天
// const formatDate = new Date(date).toLocaleDateString('zh-TW', {
//   year: 'numeric',
//   month: '2-digit',
//   day: '2-digit'
// })

// route: GET/sort
// 沒用switch的方法
  //  try{
  //   const sort = req.query.sort
  //   console.log(sort)
  //   // res.render('sort')
  //   const categoryDate = await CategoryModel.findOne({ name: sort}).lean()
  //   const records = await RecordModel.find({ categoryId: categoryDate._id}).populate('categoryId').lean()
  //   const data = records.map(record => {
  //     const {_id, name, date, amount} = record
  //     const formatDate = moment.utc(date).format('YYYY/MM/DD')
  //     return {
  //       _id,
  //       name,
  //       date: formatDate,
  //       amount,
  //       icon: record.categoryId.icon
  //     }
  //   })
  //   const totalAmount = data.reduce(((accumulator, item) => {
  //     return accumulator + item.amount
  //   }),0 )
  //   res.render('sort', {records: data, sort, totalAmount})
  // }catch(err){
  //   console.log(err)
  // }