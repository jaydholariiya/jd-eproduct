const mongoose = require('mongoose');
let express = require('express');
let app = express();
let cors = require("cors");
let jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';
app.use(cors());

function verifyToken(req,res,next){

    let token = req.headers["authorization"];
    if(token){
    token = token.split(' ')[1];
    console.log("token generated",token);
jwt.verify(token , jwtKey , (err , valid)=> {
    if(err){
        res.send({result : "something wrong in the middleware"})
    }
    else{
        next();
    }
})
    }
    else{
        res.send({result : "something wrong in the middleware"})
    }
    
}

require('./db/config')
let product = require('./db/User')
let products = require('./db/Product');
app.use(express.json())

app.post("/register",async (req,res)=>{
    let data = new product(req.body);
    let result = await data.save();
    result = result.toObject();
    delete result.password;
   
    if(result){
      jwt.sign({result},jwtKey,(err,token)=>{
        if(err){
            console.log("Something went wrong");
        }
        res.send({result , auth : token})
      }
    

    )}
    else{
        res.send("something went to wrong")
    }
        
})

app.post("/login",async (req,res)=> {
   let user = await product.findOne(req.body).select("-password");
   if(req.body.password && req.body.email){
   if(user){
    jwt.sign({user},jwtKey,(error,token)=>{
        if(error){
            res.send({result : "something wrong.."})
        }
        res.send( {user, auth : token})
    })
    
   }
   else
   {
    res.send({'result' : 'No User Found...'})
   }
}
else{
    res.send({result : 'No User Found'});
}
})

app.post("/Add_Product",verifyToken,async (req,res)=>{
    let data = new products(req.body);
    let result = await data.save();
    res.send(result)
})


app.put("/Update_Product/:id",async (req,res)=>{
    let data = await products.updateOne({_id : req.params.id},{$set : req.body});
    res.send(data)
})

app.get("/products",async (req,res)=>{
    let data = await products.find();
    if(data.length > 0){
        res.send(data);
    }
    else{
        res.send({result : "Record Not Found"})
    }
})

app.delete("/product_delete/:id",async(req,res)=> {
 
    let result =await products.deleteOne({_id : req.params.id})
    res.send(result);
})

app.get("/productGet/:id" , async (req,res) => {
    let data = await products.findOne({_id : req.params.id});
    if(data){
    res.send(data)
    }
    else{
        res.send({result : "Record Not Found"});
    }
})

app.get("/search/:key",async (req,res)=> {
    let data = await products.find({$or : [{name : {$regex : req.params.key}}, 
        {category : {$regex : req.params.key}},
        {company : {$regex : req.params.key}},
        {price : {$regex : req.params.key}}
    ]});

    res.send(data)
})





app.listen(5000);


