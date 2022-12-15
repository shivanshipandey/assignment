const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
 
const studentSchema = new mongoose.Schema({
    studentName : {
        type : String,
        required : true
    },
    subject : {
        type : [String],
        enum : ["Maths", "English", "Hindi"],
        required : true
    },
    marks : {
        type : Number,
        required : true
    },
    userId : {
        type : ObjectId,
        ref: "teacher",
        required : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    deletedAt : {
        type : Date
    }
},
{timesetamps : true})

module.exports= mongoose.model('Student', studentSchema)