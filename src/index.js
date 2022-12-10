const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes/route')
const app = express()
mongoose.set('strictQuery', false);


app.use(express.json())

mongoose.connect('mongodb+srv://Shivanshi:zCsGYxnp3CGNrB4b@cluster0.97ded1q.mongodb.net/Shivanshi0001=DB',{
    useNewUrlParser : true
})
.then (() => console.log('MongoDB is connected'))
.catch((error) => console.log(error))

app.use(route)

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});