const SEED_USER =[{
  name: '廣志',
  email: 'example1@gmail.com',
  password:'12345678'
  },
  {
   name: '小新',
   email:'example2@gmail.com',
   password:'12345678'
  }
]

const SEED_RECORD=[
  {
    name: '午餐',
    date: '2019.4.23',
    amount: 60,
    category: '餐飲食品'
  },
  {
    name: "晚餐",
    date: '2019.4.23',
    amount: 60,
    category: '餐飲食品'
  },
  {
    name: "捷運",
    date: '2019.4.23',
    amount: 120,
    category: '交通出行'
  },
  {
    name: "租金",
    date: '2015.4.01',
    amount: 25000,
    category: '家居物業'
  },
  {
    name: "電影: 驚奇隊長",
    date: '2019.4.23',
    amount: 220,
    category: '休閒娛樂'
  }
]

const SEED_CATEGORY = [
  {
    name: "家居物業",
    icon:"https://fontawesome.com/icons/home?style=solid"
  },
  {
    name: '交通出行',
    icon:"https://fontawesome.com/icons/shuttle-van?style=solid"
  },
  {
    name:'休閒娛樂',
    icon: "https://fontawesome.com/icons/grin-beam?style=solid"
  },
  {
    name: '餐飲食品',
    icon: "https://fontawesome.com/icons/utensils?style=solid"
  },
  {
    name: '其他',
    icon: "https://fontawesome.com/icons/pen?style=solid"
  }

]

module.exports = {SEED_USER, SEED_RECORD, SEED_CATEGORY}