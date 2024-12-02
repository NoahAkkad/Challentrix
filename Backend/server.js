require('dotenv').config()
const { sequelize, User } = require('./models');

const express = require('express')

const server = express()
const PORT = process.env.PORT || 3000

sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err))

server.use(express.json())
server.use(express.urlencoded({extended:true}))

server.use('/test', require('./tests/user_crud'))

server.listen(PORT, () => {
    console.log(`server is running`)} )