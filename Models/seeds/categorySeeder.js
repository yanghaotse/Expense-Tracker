const CategoryModel = require('../category')
const {SEED_CATEGORY} = require('../data/seedsData')
const db = require('../../config/mongoose')

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}



db.once('open', async () => {
  try {
    // Model.create()可以直接傳進一陣列
    await CategoryModel.create(SEED_CATEGORY);
    console.log('所有類別創建完成');
    process.exit();
  } catch (err) {
    console.log(err);
  }
});
// 也可以這樣寫，但不用這麼麻煩
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
