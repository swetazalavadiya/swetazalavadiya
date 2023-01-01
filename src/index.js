const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/route')
const app = express()

app.use(express.json())
app.use('/', router)

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://sweta1234:sweta5678@sweta2.rwx6dlh.mongodb.net/test', {useNewUrlParser: true})
.then(()=>console.log("MongoDB Connected"))
.catch((err)=> console.log(err))

app.listen(process.env.PORT || 3000, () => {
    console.log("Express is running on port", (process.env.PORT || 3000));
})

