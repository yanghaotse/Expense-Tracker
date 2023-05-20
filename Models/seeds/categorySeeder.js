const mongoose = require('mongoose')
const CategoryModel = require('../category')
const {SEED_CATEGORY} = require('../datas/seedsData')


if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true,  useUnifiedTopology: true})

const db = mongoose.connection


db.on('error', () => {
  console.log(error)
})


db.once('open', async () => {
  try {
    // .create()可以直接傳進一陣列
    await CategoryModel.create(SEED_CATEGORY);
    console.log('所有類別創建完成');
    process.exit();
  } catch (err) {
    console.log(err);
  }
});

// db.once('open', async() => {
//   try {
//     await Promise.all(
//       SEED_CATEGORY.map(async seedCategory => {
//       await CategoryModel.create(seedCategory)
//       })
//     )
//     console.log('category created')
//     process.exit()
//   }catch(err){
//     console.log(err)
//   }
// })
