const teacherModel = require('../models/teacherModel')

const createTeacher = async function(req, res){
    try{
        let data = req.body
        let {name, email, password} = data

        if(data.length ==0){
             return res.status(400).send({ status : false, message : "data body cannot be empty"})
        }

        if(!name){
           return res.status(400).send({ status : false, message : "Name is mandatory"})
        }

        if(!email){
            res.status(400).send({ status : false, message : "email is mandatory"})
        }

        let mailCheck = await teacherModel.findOne({email})
        if(mailCheck){
           return res.status(400).send({ status : false, message : "Email is already registered"})
        }

        if(!password){
           return res.status(400).send({ status : false, message : "password is mandatory"})
        }

        let passCheck = await teacherModel.findOne({password})
        if(passCheck){
            res.status(400).send({ status : false, message : "Password should be unique"})
        }

        if(password.length < 8 || password.length > 15){
          return  res.status(400).send({ status : false, message : "password should lie under 8 to 15 characters"})
        }

        if (typeof (password) != "string") {
            return res.status(400).send({
                 status: false, message: "Give Password only in a String."
            })
       }

       let teacherData = await teacherModel.create(data)
      return res.status(201).send({ status : true,message : teacherData})
    }catch(error){
        res.status(500).send({status: false,message: error.message})

     }
}

module.exports= {createTeacher}