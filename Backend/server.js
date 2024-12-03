const express = require('express')
const { Sequelize } = require('sequelize')
const config = require('./config/config.json')[process.env.NODE_ENV || 'development']
const db = require('./models')

const server = express()
const PORT = process.env.PORT || 3000

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
})

server.use(express.json())

server.use('/test', require('./tests/user_crud'))

db.sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})
