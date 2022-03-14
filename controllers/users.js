const Users = require("../models/users");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


const express = require("express");
const { cookie } = require("express/lib/response");

// Middleware for Authentication Jwt
module.exports.auth = async(req,res,next) =>{
    try{
        const token = req.cookies.jwtt;
        const verifyUser = jwt.verify(token, process.env.SECRET);
        next();
    }
    catch(e){
        res.send(e.message)
    }
}

// Register GET
module.exports.renderRegister = async(req,res)=>{
    res.render("users/register")
}

// Register POST
module.exports.register = async(req,res) =>{
    try{
        // Email check
        const emailCheck = await Users.findOne({email:req.body.email});
        if(emailCheck){
            res.send("Email already exist!")
        }
        else{
            const{ name,email,number,password } = req.body;
            const hash = await bcrypt.hash(password,12);
            const user = await new Users({
                name,
                email,
                password:hash,
                number
            });
            await user.save();
            res.redirect(`/api/todos/${user._id}`);
        }


    }catch(e){
        res.send(e)
    }
};

// LoginPage GET
module.exports.loginPage = async(req,res) =>{
    res.render("users/login")
};

// Login POST
module.exports.login = async(req,res) =>{
    try{
        const {email,password} = req.body;
        
        // Email Check
        const user = await Users.findOne({email});
        if(!user) return res.send("Email or Password is incorrect");   

        // Password Check
        const validPw = await bcrypt.compare(password, user.password);
        if(!validPw){
            res.send("Email or Password is incorrect");
        }
        else{
            const token = jwt.sign({_id:user._id},process.env.SECRET)
            // console.log(token);
            
            res.cookie('jwtt', token, {
                 expires: new Date(Date.now() + 9000000),
                 httpOnly: true 
            });
                   

            
            res.redirect(`/api/todos/${user._id}`);
        }   
    }
    catch(e){
        res.send(e)
    }
};
