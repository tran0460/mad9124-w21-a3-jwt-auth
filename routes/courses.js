const express = require('express')
const Course = require('../models/Course')
const router = express.Router()
const sanitizeBody = require('../middleware/sanitizeBody')


router.get('/', async (req, res) => {
    const courses =  await Course.find()
    res.json({data: courses.map(course => formatResponseData('courses', course.toObject()))})
})
router.post('/', sanitizeBody, async (req, res) => {
    let attributes = req.body.data.attributes 
    delete attributes._id 
    let newCourse = new Course(attributes)
    try {
        await newCourse.save()
        res.status(201).json({data: formatResponseData('courses', newCourse.toObject())})
    } catch (err) {
        res.status(500).send({
            errors: [
                {
                status: '500',
                title: 'Server error',
                description: 'Problem saving document to the database.',
                },
            ],
        })
    }
})
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('students')
        if(!course) {
            throw new Error('Resource not found')
        }
    res.json({data: formatResponseData('courses', course.toObject())})
    }
    catch (error) {
        sendResourceNotFound(req, res)
    }
})
router.patch('/:id', sanitizeBody,  async (req, res) => {
    const { _id, ...attributes } = req.body.data.attributes
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id, 
            { _id: req.params.id, ...attributes},
            {
                new: true,
                runValidators: true
            }
        )
        if(!course) {
            throw new Error('Resource not found')
        }
        res.json({data: formatResponseData('courses', course.toObject())})
    }
    catch (error) {
        sendResourceNotFound(req, res)
    }
})
router.put('/:id', sanitizeBody, async (req, res) => {
    const {_id, ...attributes} = req.body.data.attributes
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id, 
            {_id: req.params.id, ...attributes},
            {
                new: true,
                overwrite: true,
                runValidators: true
            }
        )
        console.log(course)
        if(!course) {
            throw new Error('Resource not found')
        }
        res.json({data: formatResponseData('courses', course.toObject())})
    }
    catch (error) {
        sendResourceNotFound(req, res)
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndRemove(req.params.id)
        if (!course) throw new Error('Resource not found')
        res.json( { data: formatResponseData('courses', course.toObject())} )
    } catch (error) {
        sendResourceNotFound(req, res)
    }
})


function formatResponseData(type, resource) {
    const {_id, ...attributes} = resource
    return {type, id: _id, attributes}
}

function sendResourceNotFound(req, res) {
    res.status(404).json({
        errors: [
        {
            status: '404',
            title: 'Resource does not exist',
        }
        ]
    })
}

module.exports = router

