const express = require('express')
const router = express.Router()
const db = require('../models')


// Create a new user
router.post('/users', async (req, res) => {
    try {
        const { username, password } = req.body
        const newUser = await db.User.create({ username, password })
        res.status(201).json(newUser)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
})

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await db.User.findAll()
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message })
    }
})

// Get a user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await db.User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
})

// Update a user by ID
router.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const { username, password } = req.body
        const user = await db.User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        user.username = username || user.username
        user.password = password || user.password

        await user.save()
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const user = await db.User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        await user.destroy()
        res.status(204).send() // No content status
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router