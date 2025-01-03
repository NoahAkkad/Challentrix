const express = require('express')
const Category = require('./category_crud')

const router = express.Router()

router.post('/', AdminAuthorize('admin') , async (req, res) => {
    try {
        const { Name, Description } = req.body
        const category = await Category.create({ Name, Description })
        res.status(201).json({ message: 'Category created successfully', data: category })
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message })
    }
})

router.get('/', AdminAuthorize('admin') , async (req, res) => {
    try {
        const categories = await Category.findAll()
        res.status(200).json({ message: 'Categories retrieved successfully', data: categories })
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories', error: error.message })
    }
})

router.get('/:id', AdminAuthorize('admin') , async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByPk(id)

        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }

        res.status(200).json({ message: 'Category retrieved successfully', data: category })
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving category', error: error.message })
    }
})

router.put('/:id', AdminAuthorize('admin') , async (req, res) => {
    try {
        const { id } = req.params
        const { Name, Description } = req.body

        const category = await Category.findByPk(id)

        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }

        await category.update({ Name, Description })
        res.status(200).json({ message: 'Category updated successfully', data: category })
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message })
    }
})

router.delete('/:id', AdminAuthorize('admin') , async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id)

        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }

        await category.destroy()
        res.status(200).json({ message: 'Category deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message })
    }
})

module.exports = router
