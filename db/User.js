let mongoose = require('mongoose');
let Schemas = mongoose.Schema({
    name : String,
    email : String,
    password : String
})

module.exports = mongoose.model("users",Schemas);