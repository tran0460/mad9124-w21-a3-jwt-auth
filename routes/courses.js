import createDebug from 'debug'
import sanitizeBody from '../middleware/sanitizeBody.js'
import Course from '../models/Course.js'
import express from 'express'
// import ResourceNotFoundException from '../exceptions/ResourceNotFoundException.js'
import authUser from '../middleware/auth.js'
import authAdmin from '../middleware/authAdmin.js'
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException.js'


const debug = createDebug('mad9124-w21-a3-jwt-auth:routes:courses')
const router = express.Router()

router.use("/", sanitizeBody, authUser)

router.get('/', authUser, async (req, res) => {
  const collection = await Course.find().populate('students')
  res.send({ data: formatResponseData(collection) })
})

router.post('/', authAdmin, async (req, res, next) => {
    new Course(req.sanitizeBody)
    .save()
    .then(newCourse => res.status(201).json({ data: formatResponseData(newCourse) }))
    .catch(next)
})

router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('students')
    if (!course) throw new ResourceNotFoundException(
      `we could not find a course with id: ${req.params.id}`
    )
    res.json({ data: formatResponseData(course) })
  } catch (err) {
    next(err);
  }
})

const update =
  (overwrite = false) =>
  async (req, res, next) => {
    try {
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      )
      if (!course) throw new ResourceNotFoundException(
        `we could not find a course with id: ${req.params.id}`
      )
      res.json({ data: formatResponseData(course) })
    } catch (err) {
      next(err)
    }
  }
router.put('/:id', authAdmin, sanitizeBody, update(true))
router.patch('/:id', authAdmin, sanitizeBody, update(false))

router.delete('/:id', authAdmin, async (req, res, next) => {
  try {
    const course = await Course.findByIdAndRemove(req.params.id)
    if (!course) throw new ResourceNotFoundException(
      `we could not find a course with id: ${req.params.id}`
    )
    res.json({ data: formatResponseData(course) })
  } catch (err) {
    next(err)
  }
})

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. 'courses'
 * @param {Object | Object[]} payload An array or instance object from that collection
 * @returns
 */
function formatResponseData(payload, type = 'courses') {
  if (payload instanceof Array) {
    return payload.map((resource) => format(resource))
  } else {
    return format(payload)
  }
  function format(resource) {
    const { _id, ...attributes } = resource.toObject()
    return { type, id: _id, attributes }
  }
}


export default router


