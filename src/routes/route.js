
const express = require('express')
const route= express.Router()
const teacherController = require('../controller/teacherController')

route.post('/create', teacherController.createTeacher)


module.exports = route