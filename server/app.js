const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const sha1 = require("sha1");
const jwt = require("jsonwebtoken");
mongoose.connect("mongodb://0.0.0.0:27017/aditi");


const User = mongoose.model("user", mongoose.Schema({
    name : String,
    email : String,
    password : String
}))

app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(cors());

app.post("/api/user/signup", (req, res)=>{
    req.body.password = sha1(req.body.password);
    delete req.body.re_pass;
    User.create(req.body, (err)=>{
        res.status(200).json({ success : true });
    })
})
app.post("/api/user/auth", (req, res)=>{
    let {email, password} = req.body;
    User.find({ email : email }, (err, result)=>{
        if(result.length > 0)
        {
            
            if(result[0].password == sha1(password))
            {
                let user = {id : result[0]._id, email : result[0].email};
                let token = jwt.sign(user, "the stepping stone");
                res.status(200).json({ token });

            }
            else{
                console.log("************");
                res.status(401).json({ errType : 2 })
            }
        }
        else{
            res.status(401).json({ errType : 1 })
        }
    })
})




app.listen(4200, ()=>{
    console.log("live server running");
})