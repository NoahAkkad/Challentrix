const express = require('express')
const passport = require('passport')
//for gmail auth requirement
require('../middleware/gmail_passport')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('<a href="/auth/google">Sign In with Google</a>')
})

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
    res.send(`Hello, ${req.user.displayName}`) 
})

router.get('/logout', (req, res) => {
    req.logout(err => {
    if (err) return next(err)
    res.redirect('/')
    })
})

module.exports = router