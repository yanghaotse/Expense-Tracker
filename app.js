const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const RecordModel = require('./models/record')
const CategoryModel = require('./models/category')
const moment = require('moment')
const methodOverride = require('method-override')
// const {authenticator} = require('./middleware/auth')
const routes = require('./routes')

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

app.use(routes)





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