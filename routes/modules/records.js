const express = require('express')
const RecordModel = require('../../Models/record')
const CategoryModel = require('../../Models/category')
const moment = require('moment')

const router = express.Router()

// route: GET/sort
router.get('/sort', async(req, res) => {
  const userId = req.user._id
  try{
    const sort = req.query.sort
    // console.log(sort)

    const categoryDate = await CategoryModel.findOne({ name: sort}).lean()
    const records = await RecordModel.find({ userId, categoryId: categoryDate._id}).populate('categoryId').lean()
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
router.get('/new',(req, res) => {
  res.render('new')
})

// route: GET/edit
router.get('/edit/:_id',async (req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  // console.log(id) //檢查用
  try{
    const record = await RecordModel.findOne({ _id, userId }).populate('categoryId').lean()
    const formatDate = moment.utc(record.date).format('YYYY-MM-DD') // 若設定為YYYY/MM/DD也會無法轉換
    // console.log(record.date, formatDate) 檢查用

    res.render('edit', { record, formatDate })
    // console.log(records.categoryId.name)
  }catch(err){
    console.log(err)
  }
})


// route: POST/edit
router.put('/edit/:_id', async(req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  const  {name, date, category, amount} = req.body
  try{
    // const record = await RecordModel.findOne({ _id }).lean()
    // 抓取RecordModel資料若後面有加.lean()，之後用.save()儲存資料時似乎會因為資料格式問題無法儲存，故改用.updateOne。 *因取出資料格式轉換為js格式，儲存時須給mongoDB格式?
    const categoryData = await CategoryModel.findOne({ name : category}).lean()
    const record = {
      name,
      date,
      amount,
      userId,
      categoryId: categoryData._id
    }
    
    await RecordModel.updateOne({ _id, userId }, { $set: record})
    res.redirect('/')
  }catch(err){
    console.log(err)
  }
})

// route: POST/new
router.post('/new', async(req, res) => {
  const userId = req.user._id
  console.log(req.user)
  const {name, date, category, amount} = req.body
  // console.log(name,date, category, amount) //檢查用
  const categoryData = await CategoryModel.findOne( {name: category}).lean()
  try{
    await RecordModel.create({
      name,
      date,
      amount,
      userId,
      categoryId: categoryData._id
    })
    res.redirect('/')
  }catch(err){
    console.log(err)
  }
})

// route: POST/delete
router.delete('/delete/:_id', async(req, res) => {
  const userId = req.user._id
  const _id = req.params._id
  try{
    await RecordModel.findByIdAndDelete({_id, userId})
    res.redirect('/')
  }catch(err){
    console.log(err)
  }
})


module.exports = router
