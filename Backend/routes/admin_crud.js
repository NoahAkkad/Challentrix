const express = require('express')
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')
const {AdminAuthorize} = require('../middleware/authorize')

const router = express.Router()

router.post('/', AdminAuthorize('admin') , async (req, res) => {
    try {
        const { firstName, lastName, email, password , role} = req.body
        const hashedpassword = await bcrypt.hash(password , 10)
        const admin = await Admin.create({ firstName, lastName, email, password : hashedpassword , role})
        res.status(201).json({ message: 'Admin created successfully', data: admin })
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message })
    }
})

router.get('/', AdminAuthorize('admin') , async (req, res) => {
    try {
        const admins = await Admin.findAll()
        res.status(200).json({ message: 'Admins retrieved successfully', data: admins })
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving admins', error: error.message })
    }
})

router.get('/:id', AdminAuthorize('admin') , async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByPk(id)

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' })
        }

        res.status(200).json({ message: 'Admin retrieved successfully', data: admin })
    } 
    catch (error) {
        res.status(500).json({ message: 'Error retrieving admin', error: error.message })
    }
})

router.put('/:id', AdminAuthorize('admin') , async (req, res) => {
    try {
        const { id } = req.params
        const { firstName, lastName, email, password } = req.body

        const admin = await Admin.findByPk(id)

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' })
        }

        await admin.update({ firstName, lastName, email, password })
        res.status(200).json({ message: 'Admin updated successfully', data: admin })
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin', error: error.message })
    }
})

router.delete('/:id', AdminAuthorize('admin') , async (req, res) => {
    try {
        const { id } = req.params
        const admin = await Admin.findByPk(id)

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' })
        }

        await admin.destroy()
        res.status(200).json({ message: 'Admin deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin', error: error.message })
    }
})

module.exports = router
