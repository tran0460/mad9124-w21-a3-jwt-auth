import createDebug from 'debug'
import sanitizeBody from '../middleware/sanitizeBody.js'
import Course from '../models/Course.js'
import express from 'express'
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException'
import authUser from '../middleware/auth'
import authAdmin from '../middleware/authAdmin'


const debug = createDebug('week9:routes:courses')
const router = express.Router()

router.get('/', async (req, res) => {
  const collection = await Course.find().populate('owner')
  res.send({ data: formatResponseData(collection) })
})

router.post('/', sanitizeBody, async (req, res, next) => {
    new Course(req.sanitizeBody)
    .save()
    .then(newCourse => res.status(201).json({ data: formatResponseData(newCourse) }))
    .catch(next)
//   let newCourse = new Course(req.sanitizedBody)
//   try {
//     await newCourse.save()
//     res.status(201).json({ data: formatResponseData(newCourse) })
//   } catch (err) {
//     debug(err)
//     res.status(500).send({
//       errors: [
//         {
//           status: '500',
//           title: 'Server error',
//           description: 'Problem saving document to the database.',
//         },
//       ],
//     })
//   }
})

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('owner')
    if (!course) throw new ResourceNotFoundException(
      `we could not find a course with id: ${req.params.id}`
    )
    res.json({ data: formatResponseData(course) })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

const update =
  (overwrite = false) =>
  async (req, res) => {
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
      if (!course) throw new Error('Resource not found')
      res.json({ data: formatResponseData(course) })
    } catch (err) {
      sendResourceNotFound(req, res)
    }
  }
router.put('/:id', sanitizeBody, update(true))
router.patch('/:id', sanitizeBody, update(false))

router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndRemove(req.params.id)
    if (!course) throw new Error('Resource not found')
    res.json({ data: formatResponseData(course) })
  } catch (err) {
    sendResourceNotFound(req, res)
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

function sendResourceNotFound(req, res) {
  res.status(404).send({
    error: [
      {
        status: '404',
        title: 'Resource does nto exist',
        description: `We could not find a course with id: ${req.params.id}`,
      },
    ],
  })
}

export default router


