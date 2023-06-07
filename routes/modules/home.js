const express = require('express')
const router = express.Router()
const RecordModel = require('../../models/record')
const moment = require('moment')

router.get('/', async (req, res) => {
  const userId = req.user._id
  console.log('req.user.name:',req.user.name)
  // output: req.user.name: ht
  console.log('res.locals.user:', res.locals.user.name)
  // output: res.locals.user: ht
  try{
    // const user = req.user.toObject()
    const records = await RecordModel.find({userId}).populate('categoryId').lean()
    const data = records.map(record => {
      const {_id, name, date, amount} = record
      // console.log(date) //檢查用
      //output:
      // 2019-04-22T16:00:00.000Z
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
    
    res.render('index', {records: data , totalAmount})
  }catch(err){
    console.log(err)
  }
})

module.exports = router