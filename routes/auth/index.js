import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'
import createDebug from 'debug'
import express from 'express'
import authenticate from '../../middleware/auth.js'

const debug = createDebug('week9:routes:auth')
const router = express.Router()

router.post('/users', sanitizeBody, async (req, res, next) => {
    new User(req.sanitizeBody)
    .save()
    .then(newUser => res.status(201).json(formatResponseData(newUser)))
    .catch(next)
})
router.post('/tokens', sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody
  const user = await User.authenticate(email, password)
  if (!user) {
    return res.status(401).json({
      errors: [
        {
          status: '401',
          title: 'Incorrect username or password.',
        },
      ],
    })
  }
  res
    .status(201)
    .json(
      formatResponseData({ accessToken: user.generateAuthToken() }, 'tokens')
    )
})
router.get('/users/me', authenticate, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v')
  res.json(formatResponseData(user))
})
/**
* Format the response data object according to JSON:API v1.0
* @param {string} type The resource collection name, e.g. 'cars'
* @param {Object | Object[]} payload An array or instance object from that collection
* @returns
*/
function formatResponseData(payload, type = 'users') {
  if (payload instanceof Array) {
    return { data: payload.map((resource) => format(resource)) }
  } else {
    return { data: format(payload) }
  }
  function format(resource) {
    const { _id, ...attributes } = resource.toJSON
      ? resource.toJSON()
      : resource
    return { type, id: _id, attributes }
  }
}
export default router