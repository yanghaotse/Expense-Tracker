const CategoryModel = require('../category')
const {SEED_CATEGORY} = require('../seedsData')
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

// db.once('open', async() => {
//   try {
//     await Promise.all(
//       SEED_CATEGORY.map(async seedCategory => {Model
//       await CategoryModel.create(seedCategory)
//       })
//     )
//     console.log('category created')
//     process.exit()
//   }catch(err){
//     console.log(err)
//   }
// })
