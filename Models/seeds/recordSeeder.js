const UserModel = require('../user')
const RecordModel = require('../record')
const CategoryModel = require('../category')
const bcrypt = require('bcryptjs')
const {SEED_USER, SEED_RECORD} = require('../seedsData')
const db = require('../../config/mongoose')

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

db.once('open', async () => {
  try {
    // 建立使用者資料
    await Promise.all(
      SEED_USER.map(async (seedUser, seedUser_index) => {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(seedUser.password, salt);
        const user = await UserModel.create({
          name: seedUser.name,
          email: seedUser.email,
          password: hash,
        });
        console.log('User created')
        const seedCategory = await CategoryModel.find().lean()
        // 建立Records資料
        await Promise.all(
          SEED_RECORD.slice( 4 * seedUser_index, 4 + seedUser_index).map(async (seedRecord) => {
            // 用slice()切割資料分別給 廣志/小新
            const {name , date, amount} = seedRecord
            // 建立種子資料"類別"與"使用者"關聯
            const referenceCategory = await seedCategory.find(data => data.name === seedRecord.category)
            seedRecord.userId = user._id;
            seedRecord.categoryId = referenceCategory._id;
            await RecordModel.create({
              name,
              date,
              amount,
              userId: seedRecord.userId,
              categoryId: seedRecord.categoryId
            });
          })
        )     
        console.log('所有使用者與記帳資料創建完成');
        process.exit();
      })
    )
    
  }catch (err) {
    console.log(err);
  }
});


