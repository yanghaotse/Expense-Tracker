db.once('open', async () => {
  try {
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
        await Promise.all(
          SEED_RECORD.slice( 4 * seedUser_index, 4 + seedUser_index).map(async (seedRecord) => {
            // 用slice()切割資料分別給不同使用者
            const {name , date, amount} = seedRecord
            const referenceCategory = seedCategory.find(data => data.name === seedRecord.category)
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