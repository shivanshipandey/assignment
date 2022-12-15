const teacherModel = require('../models/teacherModel')
const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId.isValid
const jwt = require('jsonwebtoken')


const authentication = async function (req, res, next) {
    try {
        let token = req.headers["authorization"]
        if (!token) { return res.status(400).send({ status: false, message: "please enter token" }) }
        let decodetoken;
        try {
            decodetoken = jwt.verify(token.split(" ")[1], "heySecret")
        } catch (err) {
            return res.status(401).send({ status: false, message: err.message })
        }
        req.token = decodetoken
        next()

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const authorization = async function (req, res, next) {

    try {
        let userId = req.params.userId
        
        if (!Objectid(userId)) {
            return res.status(400).send({ status: false, message: " PLEASE ENTER CORRECT mongoose USER ID" })
        }

        const finduserIdInDb = await teacherModel.findById(userId)
        if (!finduserIdInDb) {
            return res.status(404).send({ status: false, message: `there is no data with this  ${userId}  id in database` })
        }

        if (finduserIdInDb.userId != req.token.id) return res.status(403).send({ status: false, message: "authorization failed,userId and token are not of the same user" })
        next()

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { authentication,authorization }

