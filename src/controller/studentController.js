const studentModel = require('../models/studentModel')
const teacherModel= require('../models/teacherModel')
const mongoose = require('mongoose')
let isValid = mongoose.Types.ObjectId.isValid


//======================================> CREATE STUDENT <==================================//

const createStudent = async function(req, res){
     try{

        let data = req.body
        let { studentName, subject, marks, userId} = data
        
        if(!studentName){
            return res.status(400).send({status : false, message : "StudentName is mandatory"})
        }

        if(!subject){
            return res.status(400).send({status : false, message : "Subject is mandatory"})
        }

        if(!(subject == "Maths" || subject == "English" || subject == "Hindi")){
            return res.status(400).send({ status : false, message : "Subject can be from enum only"})
        }

        if(!marks){
            return res.status(400).send({status : false, message : "Marks is mandatory"})
        }
 

        if(!userId){
            return res.status(400).send({ status : false, message : "userId is mandatory"})
        }

        if(!isValid(userId)){
            return res.status(400).send({ status : false, message : "UserId is invalid"})
        }

        let idCheck = await teacherModel.findOne({_id : userId})
        if(!idCheck){
            return res.status(404).send({ status : false, message : "This user is not found"})
        }

        if (!Array.isArray(subject)) {
            return res.status(400).send({ status: false, message: "Give subject only in a array of String." })
        }

        let studentData = await studentModel.create(data)
        return res.status(201).send({ status : false, message : studentData})

     }catch(error){
        res.status(500).send({ status : false, message : error.message})
     }
}


//====================================> GET STUDENT'S DATA BY PATH PARAMS <==============================//

let studentData = async function(req, res){
    try{

       let userId = req.params.userId

       if(!userId){
        return res.status(400).send({ status : false, message : "userId is mandatory"})
       }
 
       if(!isValid(userId)){
        return res.status(400).send({ status : false, message : "UserId is not valid"})
       }

       let userCheck = await studentModel.find({userId})
       if(!userCheck.length){
        return res.status(400).send({ status : false, message : "User is not found"})
       }
       return res.status(200).send({ status : true, message : userCheck})

       
    }catch(error){
        res.status(500).send({ status : false, message : error.message})
    }

} 



//===============================> GET STUDENT'S BY QUERY PARAMS <=============================//

const getStudentData = async function(req, res){
    try{

        let data = req.query

        let getData = await studentModel.find({ $and: [data, { isDeleted: false }] }).select({_id:1, studentName : 1, subject : 1, userId :1} )

        if(!getData.length){
            return res.status(404).send({ status : false, message : "Data not found"})
        }

        return res.status(200).send({ status : false, message : getData})
    }catch(error){
        res.status(500).send({status : false, message : error.message})
    }
}


//===============================> UPDATE STUDENT <====================================//

const editStudent = async function (req, res){
    try{

        let userId = req.params.userId

        if(!userId){
            return res.status(400).send({ status : false, message : "userId is mandatory"})
           }
     
           if(!isValid(userId)){
            return res.status(400).send({ status : false, message : "UserId is not valid"})
           }
    
           let userCheck = await studentModel.findOne({_id :userId, isDeleted : false})
           if(!userCheck){
            return res.status(400).send({ status : false, message : "User is not found"})
           }

           let data = req.body
           let { studentName, subject, marks, isDeleted} = data

           if (Object.keys(obj).length === 0 ) {
            return res.status(400).send({ status: false, message: "Please give some parameters to check" })
       }
        

        if(studentName){
            let nameCheck = await studentModel.findOne({studentName})
            if(nameCheck){
                return res.status(400).send({ status : false, message : "Student Name is already registered"})
            }
        }

        if(subject){
        if(!(subject == "Maths" || subject == "English" || subject == "Hindi")){
            return res.status(400).send({ status : false, message : "Subject can be from enum only"})
        }
    
          if (!Array.isArray(subject)) {
            return res.status(400).send({ status: false, message: "Give subject only in a array of String." })
        }
    }

    if(isDeleted){
        if (typeof(isDeleted) != "boolean") {
            return res.status(400).send({ status: false, message: "isDeleted can be true or false only" })
       }
    }

    if(marks){
        if(typeof(marks) != "Number"){
            return res.status(400).send({ status : false, message : "Marks should be in Numbers"})
        }
    }

    let studentUpdate = await studentModel.findOneAndUpdate({_id : userId, isDeleted : false}, {studentName, marks, subject}, {new : true})
    return res.status(200).send({ status : false, message : studentUpdate})


    }catch(error){
        res.status(500).send({status : false, message : error.message})
    }
}


//==================================> DELETE STUDENTS <=============================//

const deleteStudent = async function(req, res){
    try{

           let studentId = req.params.studentId

           if(!studentId){
               return res.status(400).send({ status : false, message : "studentId is mandatory"})
              }
        
              if(!isValid(studentId)){
               return res.status(400).send({ status : false, message : "studentId is not valid"})
              }
       
              let userCheck = await studentModel.findOne({studentId, isDeleted : false})
              if(!userCheck){
               return res.status(400).send({ status : false, message : "Either user is already deleted or not found"})
              }

           let removeStudent = await studentModel.findOneAndUpdate({_id : studentId}, { isDeleted: true, deletedAt: Date.now() }, { new: true }).select({ isDeleted: 1, deletedAt: 1 })
           return res.status(200).send({status : false,message: "Book deletion is successful", data : removeStudent})
    
        }catch(error){
        return res.status(500).send({ status : false, message : error.message})
    }
}

module.exports = {createStudent, studentData, getStudentData, editStudent,deleteStudent}