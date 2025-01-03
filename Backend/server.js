require('dotenv').config()

const express = require('express')
const session = require('express-session')
const { Sequelize } = require('sequelize')
const config = require('./config/config.json')[process.env.NODE_ENV || 'development']
const db = require('./models')
const passport = require('passport')
const { ErrorHandler } = require('./middleware/errorHandler')

const server = express()
const PORT = process.env.PORT || 3000

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}))

server.use(passport.initialize())
server.use(passport.session())

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
})

// server.use('/', require('./routes/gmail_auth'))
server.use('/', require('./routes/apple_auth'))

server.use(ErrorHandler)

db.sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})
