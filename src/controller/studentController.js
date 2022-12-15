let studentModel = require('../models/studentModel')
let teacherModel = require('../models/teacherModel')
let mongoose = require('mongoose')
let isValid = mongoose.Types.ObjectId.isValid


//======================================> CREATE STUDENT <==================================//


const createStudent = async function (req, res) {
    try {

     
        let data = req.body
        let { studentName, subject, marks} = data

        data.userId = req.params.userId

        if (!studentName) {
            return res.status(400).send({ status: false, message: "StudentName is mandatory" })
        }

        if (!subject) {
            return res.status(400).send({ status: false, message: "Subject is mandatory" })
        }

        if (!(subject == "Maths" || subject == "English" || subject == "Hindi")) {
            return res.status(400).send({ status: false, message: "Subject can be from enum only" })
        }

        if (!marks) {
            return res.status(400).send({ status: false, message: "Marks is mandatory" })
        }


        if (!Array.isArray(subject)) {
            return res.status(400).send({ status: false, message: "Give subject only in a array of String." })
        }

        let getData = await studentModel.findOne({ studentName, subject })

        if (getData) {
            let finalData = await studentModel.findOneAndUpdate({ studentName, subject }, { $set: { marks: marks + getData.marks } }, { new: true })
            return res.status(201).send({ status: true, data: finalData })
        }

        let studentData = await studentModel.create(data)
        return res.status(201).send({ status: false, message: studentData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//====================================> GET STUDENT'S DATA BY PATH PARAMS <==============================//

let studentData = async function (req, res) {
    try {

        let userId = req.params.userId

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is mandatory" })
        }

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "UserId is not valid" })
        }

        let userCheck = await studentModel.find({ userId })
        if (!userCheck.length) {
            return res.status(400).send({ status: false, message: "User is not found" })
        }
        return res.status(200).send({ status: true, message: userCheck })


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}



//===============================> GET STUDENT'S BY QUERY PARAMS <=============================//

const getStudentData = async function (req, res) {
    try {

        let studentName = req.query.studentName
        let subject = req.query.subject

        let filter = { isDeleted: false }

        if(studentName){
        let nameCheck = await studentModel.findOne({ studentName })
        if (!nameCheck) {
            return res.status(404).send({ status: false, message: "No data found" })
        }
        return res.status(200).send({ status : true, message : nameCheck})

    }


    if(subject){
        let subCheck = await studentModel.findOne({ subject })
        if (!subCheck) {
            return res.status(404).send({ status: false, message: "No such data found" })
        }
        return res.status(200).send({ status : true, message : subCheck})
    }

        let data = await studentModel.find(filter)
        if (data.length == 0) return res.status(404).send({ status: false, message: "no data found" })
        return res.status(200).send({ status: true, data: data })



    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//===============================> UPDATE STUDENT <====================================//

const editStudent = async function (req, res) {
    try {

        let userId = req.params.userId
        let studentId = req.params.studentId

        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is mandatory" })
        }

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "UserId is not valid" })
        }

        if(!studentId){
            return res.status(400).send({ status : false, message : "StudentId is mandatory"})
        }

        if(!isValid(studentId)){
            return res.status(400).send({ status : false, message : "studentId is not valid"})
        }

        let userCheck = await studentModel.findOne({ _id: studentId, userId: userId, isDeleted: false })
        if (!userCheck) {
            return res.status(400).send({ status: false, message: "User is not found" })
        }

        let data = req.body
        let { studentName, subject, marks} = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Please give some parameters to check" })
        }


        if (studentName) {
            let nameCheck = await studentModel.findOne({ studentName })
            if (nameCheck) {
                return res.status(400).send({ status: false, message: "Student Name is already registered" })
            }
        }

        if (subject) {
            if (!(subject == "Maths" || subject == "English" || subject == "Hindi")) {
                return res.status(400).send({ status: false, message: "Subject can be from enum only" })
            }

            if (!Array.isArray(subject)) {
                return res.status(400).send({ status: false, message: "Give subject only in a array of String." })
            }
        }
       

        if (marks) {
            if (typeof (marks) != "Number") {
                return res.status(400).send({ status: false, message: "Marks should be in Numbers" })
            }
        }

        let studentUpdate = await studentModel.findOneAndUpdate({ _id: studentId, userId: userId, isDeleted: false }, { studentName, marks, subject }, { new: true })
        return res.status(200).send({ status: false, message: studentUpdate })


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//==================================> DELETE STUDENTS <=============================//

const deleteStudent = async function (req, res) {
    try {

        let studentId = req.params.studentId
        let userId = req.params.userId

        if (!studentId){
            return res.status(400).send({ status: false, message: "studentId is mandatory" })
        }

        if(!isValid(studentId)) {
            return res.status(400).send({ status: false, message: "studentId is not valid" })
        }

        if(!userId){
            return res.status(400).send({ status : false, message : "UserId is mandatory"})
        }

        if(!isValid(userId)){
            return res.status(400).send({ status : false, message : "userId is not valid"})
        }
        

        let removeStudent = await studentModel.findOneAndUpdate({  _id: studentId, userId: userId, isDeleted: false  }, { isDeleted: true, deletedAt: Date.now() }, { new: true }).select({ isDeleted: 1, deletedAt: 1 })
        if (!removeStudent) {
            return res.status(400).send({ status: false, message: "Either user is already deleted or not found" })
        }
        return res.status(200).send({ status: false, message: "Book deletion is successful", data: removeStudent })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createStudent, studentData, getStudentData, editStudent, deleteStudent }