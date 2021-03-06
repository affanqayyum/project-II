if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser= require('body-parser')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const app = express()

const initializePassport = require('./password-config')
initializePassport(
  passport,
  email => user.find(user =>  user.email === email),
  id => users.find(user => user.id === id)
)


const users= []

app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get ( '/', (req, res) => {
  res.render('index.ejs', { name: req.body.name })
})

app.get ( '/login', (req, res) => {
  res.render('login.ejs')
})

app.post ( '/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get ( '/register', (req, res) => {
  res.render('register.ejs')
})

app.post ( '/register', async (req, res) => {
  try {
    const harshedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      name : req.body.name,
      email : req.body.email,
      password : harshedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users)
})

app.listen(3000)
