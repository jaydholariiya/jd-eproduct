require('./config');

let mongoose = require('mongoose');

let schemas = mongoose.Schema({name : String , 
                price : String,
                category : String,
                company : String , 
                userId : String
})

module.exports = mongoose.model("product",schemas);
