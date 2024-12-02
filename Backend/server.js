require('dotenv').config()

const express = require('express')

const server = express()
const PORT = process.env.PORT || 3000

server.use(express.json())
server.use(express.urlencoded({extended:true}))


server.get('/', (req, res) => {
    res.send('Welcome to Challentrix backend')
})

server.listen(PORT, () => {
    console.log(`server is running`)} )