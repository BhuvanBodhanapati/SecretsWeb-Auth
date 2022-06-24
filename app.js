
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("js-md5");

mongoose.connect("mongodb://localhost:27017/usersDB");

const app = express();

app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded(
    {extended : 'true'}
));
app.use(express.static("public"));

/////////////////////////////////////////////---------     Userschema

const userSchema = new mongoose.Schema({
    username : String,
    password : String
});

const User = new mongoose.model('User', userSchema);

////////////////////////////////////////////----------    root route /

app.route("/")
    .get(function(req,res){
        res.render('home');
    });

///////////////////////////////////////////////--------    /register

app.route("/register")
    .get(function(req,res){
        res.render("register");
    })
    .post(function(req,res){
        const newUser = new User({
                username : req.body.username,
                password : md5(req.body.password)
        });
        newUser.save(function(err) {
            if(err){
                console.log(err);
            }else{
                res.render('secrets');
            }
        });
    });

//////////////////////////////////////////////----------    /login

app.route("/login")
    .get(function(req,res){
        res.render("login");
    })
    .post(function(req,res){
        const username = req.body.username;
        const password = md5(req.body.password);
        User.findOne(
            { username : username},
            function(err,foundUser){
                if(foundUser.password == password){
                    res.render('secrets');
                }
            }
        );
    });

/////////////////////////////////////////////-----------    









app.listen(3000, function(){
    console.log("Server is running in port 3000");
});