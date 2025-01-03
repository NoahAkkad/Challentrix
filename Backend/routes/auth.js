// routes/auth.js
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('../models/User')
const Admin = require('../models/Admin')
const Verification = require('../models/Verification')

const router = express.Router()

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, photo } = req.body

    try {
        
        const existingUser = await User.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            photo,
            isVerified: false, 
        })

        const token = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 3600000)

        await Verification.create({
            userId: user.id,
            token,
            expiresAt,
        })

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        await transporter.sendMail({
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is: ${token}`,
        })

        return res.status(201).json({ message: 'User registered. Verification email sent.' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Registration failed.', error })
    }
})

router.post('/login', async (req, res) => {
    const { email, password , role } = req.body

    if(role){
        try {
            const admin = await Admin.findOne({ where: { email } })
            if (!admin || !(await bcrypt.compare(password, admin.password))) {
                return res.status(401).json({ message: 'Invalid credentials' })
            }
            const token = jwt.sign({ id: admin.id , role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
            return res.status(200).json({ message: 'Login successful', token })
        } catch (error) {
            return res.status(500).json({ message: 'Login failed', error })
        }
    }
    else{
        try {
            const user = await User.findOne({ where: { email } })
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' })
            }
    
            if (!user.isVerified) {
                return res.status(403).json({ message: 'Email is not verified' })
            }
    
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
            return res.status(200).json({ message: 'Login successful', token })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Login failed', error })
        }
    }
})

router.post('/verify', async (req, res) => {
    const { email, token } = req.body

    try {
        const user = await User.findOne({ where: { email } })
        if (!user || user.isVerified) {
            return res.status(400).json({ message: 'Invalid verification attempt.' })
        }

        const verification = await Verification.findOne({ where: { userId: user.id, token } })
        if (!verification || new Date() > verification.expiresAt) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' })
        }

        user.isVerified = true;
        await user.save();
        
        await verification.destroy();

        return res.status(200).json({ message: 'Email verified successfully.' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Verification failed.', error })
    }
})

module.exports = router