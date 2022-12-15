
const express = require('express')
const route= express.Router()
const teacherController = require('../controller/teacherController')
const studentController = require('../controller/studentController')
const middleware = require('../middleware/auth')

route.post('/register', teacherController.registration)

route.post('/login', teacherController.loginTeacher)

route.post('/student/:userId',middleware.authentication,middleware.authorization, studentController.createStudent)

route.get('/student/:userId',studentController.studentData)

route.get('/getDetails',studentController.getStudentData)

route.put('/editStudents/:userId/:studentId', middleware.authentication,middleware.authorization,studentController.editStudent)

route.delete('/deleteStudent/:userId/:studentId', middleware.authentication,middleware.authorization,studentController.deleteStudent)

module.exports = route