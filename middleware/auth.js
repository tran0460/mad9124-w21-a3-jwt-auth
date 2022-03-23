import jwt from 'jsonwebtoken'
const jwtPrivateKey = 'superSecretKey'

function parseToken(headerValue) {
    if (headerValue) {
    const [type, token] = headerValue.split(' ') 
    if (type === 'Bearer' && typeof token !== 'undefined') {
        return token
    }
    }
    return undefined
}
export default function (req, res, next) {
    const token = parseToken(req.header('Authorization'))
    if (!token) {
    return res.status(401).json({
        errors: [
        {
            title: 'Authentication failed!',
            status: 401,
            description: 'Missing bearer token!',
        },
    ],
    })
    }
    try {
    const payload = jwt.verify(token, jwtPrivateKey)
    req.user = payload.user
    next()
    } catch (err) {
    res.status(400).json({
        errors: [
        {
            status: '400',
            title: 'Validation Error',
            description: 'Invalid bearer token!',
        },
        ],
        })
    }
}