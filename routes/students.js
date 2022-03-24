const express = require('express')
const Student = require('../models/Student')
const router = express.Router()
const sanitizeBody = require('../middleware/sanitizeBody')


router.get('/', async (req, res) => {
    const students =  await Student.find()
    res.json({data: students.map(student => formatResponseData('students', student.toObject()))})
})
router.post('/', sanitizeBody, async (req, res) => {
    let attributes = req.body.data.attributes 
    delete attributes._id 
    let newStudent = new Student(attributes)
    try {
        await newStudent.save()
        res.status(201).json({data: formatResponseData('student', newStudent.toObject())})
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
        const student = await Student.findById(req.params.id)
        if(!student) {
            throw new Error('Resource not found')
        }
    res.json({data: formatResponseData('student', student.toObject())})
    }
    catch (error) {
        sendResourceNotFound(req, res)
    }
}) 
router.patch('/:id', sanitizeBody, async (req, res) => {
    const {_id, ...attributes} = req.body.data.attributes
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id, 
            {_id: req.params.id, ...attributes},
            {
                new: true,
                runValidators: true
            }
        )
        if(!student) {
            throw new Error('Resource not found')
        }
        res.json({data: formatResponseData('student', student.toObject())})
    }
    catch (error) {
        sendResourceNotFound(req, res)
    }
})
router.put('/:id', sanitizeBody, async (req, res) => {
    const {_id, ...attributes} = req.body.data.attributes
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id, 
            {_id: req.params.id, ...attributes},
            {
                new: true,
                overwrite: true,
                runValidators: true
            }
        )
        if(!student) {
            throw new Error('Resource not found')
        }
        res.json({data: formatResponseData('student', student.toObject())})
}
    catch (error) {
        sendResourceNotFound(req, res)
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndRemove(req.params.id)
        if (!student) throw new Error('Resource not found')
        res.json( { data: formatResponseData('student', student.toObject())} )
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