
const express = require('express')
const route= express.Router()
const teacherController = require('../controller/teacherController')
const studentController = require('../controller/studentController')
const middleware = require('../middleware/auth')

route.post('/register', teacherController.registration)

route.post('/login', teacherController.loginTeacher)

route.post('/student/register',middleware.authentication,studentController.createStudent)

route.get('/student/:userId', middleware.authentication,studentController.studentData)

route.get('/getDetails', middleware.authentication,studentController.getStudentData)

route.put('/editStudents/:userId', middleware.authentication,middleware.authorization,studentController.editStudent)

route.delete('/deleteStudent/:studentId', middleware.authentication,middleware.authorization,studentController.deleteStudent)

module.exports = route