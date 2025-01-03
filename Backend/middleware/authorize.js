const jwt = require('jsonwebtoken')

const UserAuthorize = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' })
    }
}

const AdminAuthorize = (allowedRole) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) { 
            return res.status(401).json({ message: 'Unauthorized. Please log in.' })
        }

        const { role } = req.session.user

        if (allowedRole != role) {
            return res.status(403).json({ message: 'Forbidden. You do not have permission to access this resource.' })
        }
        next()
    }
}

module.exports = {AdminAuthorize , UserAuthorize}