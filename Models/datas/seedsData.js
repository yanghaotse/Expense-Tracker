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
    icon:"fa-solid fa-house"
  },
  {
    name: '交通出行',
    icon:"fa-solid fa-van-shuttle"
  },
  {
    name:'休閒娛樂',
    icon: "fa-solid fa-gamepad"
  },
  {
    name: '餐飲食品',
    icon: "fa-solid fa-utensils"
  },
  {
    name: '其他',
    icon: "fa-solid fa-utensils"
  }

]

module.exports = {SEED_USER, SEED_RECORD, SEED_CATEGORY}