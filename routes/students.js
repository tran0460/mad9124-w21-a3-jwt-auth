import createDebug from 'debug'
import sanitizeBody from '../middleware/sanitizeBody.js'
import Student from '../models/Student.js'
import express from 'express'
import authUser from '../middleware/auth.js'
import authAdmin from '../middleware/authAdmin.js'
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException.js'


const debug = createDebug('a3:routes:students')
const router = express.Router()

router.use('/', sanitizeBody, authUser)

router.get('/', authUser, async (req, res) => {
  const collection = await Student.find()
  res.send({ data: formatResponseData(collection) })
})

router.post('/', authAdmin, async (req, res, next) => {
    new Student(req.sanitizedBody)
    .save()
    .then(newStudent => res.status(201).json({ data: formatResponseData(newStudent) }))
    .catch(next)
})

router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('students')
    if (!student) throw new ResourceNotFoundException(
      `we could not find a student with id: ${req.params.id}`
    )
    res.json({ data: formatResponseData(student) })
  } catch (err) {
    next(err)
  }
})

const update =
  (overwrite = false) =>
  async (req, res, next) => {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      )
      if (!student) throw new ResourceNotFoundException(
        `we could not find a student with id: ${req.params.id}`
      )
      res.json({ data: formatResponseData(student) })
    } catch (err) {
      next(err)
    }
  }
router.put('/:id', authAdmin, sanitizeBody, update(true))
router.patch('/:id', authAdmin, sanitizeBody, update(false))

router.delete('/:id', authAdmin, async (req, res, next) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.id)
    if (!student) throw new ResourceNotFoundException(
      `we could not find a student with id: ${req.params.id}`
    )
    res.json({ data: formatResponseData(student) })
  } catch (err) {
    next(err)
  }
})

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. 'students'
 * @param {Object | Object[]} payload An array or instance object from that collection
 * @returns
 */
function formatResponseData(payload, type = 'students') {
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