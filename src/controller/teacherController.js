const teacherModel = require('../models/teacherModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//=====================> REGISTRATION OF TEACHER <==========================//


const registration = async function (req, res) {
    try {
        let data = req.body
        let { name, email, password } = data

        if (data.length == 0) {
            return res.status(400).send({ status: false, message: "data body cannot be empty" })
        }

        if (!name) {
            return res.status(400).send({ status: false, message: "Name is mandatory" })
        }

        if (!email) {
            res.status(400).send({ status: false, message: "email is mandatory" })
        }

        let mailCheck = await teacherModel.findOne({ email })
        if (mailCheck) {
            return res.status(400).send({ status: false, message: "Email is already registered" })
        }

        if (!password) {
            return res.status(400).send({ status: false, message: "password is mandatory" })
        }

        data.password = await bcrypt.hash(password, 10)

        let passCheck = await teacherModel.findOne({ password })
        if (passCheck) {
            res.status(400).send({ status: false, message: "Password should be unique" })
        }

        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "password should lie under 8 to 15 characters" })
        }

        if (typeof (password) != "string") {
            return res.status(400).send({
                status: false, message: "Give Password only in a String."
            })
        }

        let teacherData = await teacherModel.create(data)
        return res.status(201).send({ status: true, message: teacherData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })

    }
}


//==============================> LOGIN TEACHER <================================//


const loginTeacher = async function (req, res) {
    try {
        let data = req.body
        let { email, password } = data

        if (!email) {
            return res.status(400).send({ status: false, message: "Email is mandatory" })
        }

        if (!password) {
            return res.status(400).send({ status: false, message: "Password is not correct" })
        }

        let check = await teacherModel.findOne({ email: email})
        if (!check) {
            return res.status(400).send({ status: false, message: "these credentials aren't present in database" })
        }

        let checkpassword = await bcrypt.compare(password, check.password);
        if (!checkpassword) return res.status(400).send({ status: false, message: "login failed this password not matches with name" })

        let token = jwt.sign(
            {
                teacherId: check._id.toString(),
                batch: "Plutonium",
                organisation: "Assignment"
            },
            "heySecret"
        );
        return res.status(201).send({ status: true, message: token })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { registration, loginTeacher }