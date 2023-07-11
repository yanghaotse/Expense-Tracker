const CategoryModel = require('../category')
const {SEED_CATEGORY} = require('../seedsData')
const db = require('../../config/mongoose')

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}


db.once('open', async () => {
  try {
    const categoryModel = await CategoryModel.find().lean()
    // Model.create()可以直接傳進一陣列
    if(categoryModel.length == 0){
      await CategoryModel.create(SEED_CATEGORY);
      console.log('所有類別創建完成');
    }
    process.exit();
  }catch (err) {
    console.log(err);
  }
});



  