const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/apple', passport.authenticate('apple'));  

router.post('/auth/apple/callback',
    passport.authenticate('apple', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect('/dashboard')
        }
)

module.exports = router
