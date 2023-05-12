const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000


app.engine('hbs', exphbs({ defaultLayout : 'main', extname: '.hbs'}))
app.use('view engine', 'hbs')

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen( port, () => {
  console.log(`App is running on http://localhost:${port}`)
})