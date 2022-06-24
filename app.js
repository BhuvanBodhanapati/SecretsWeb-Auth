
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

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
        bcrypt.hash(req.body.password, saltRounds, function(err, hash){
            const newUser = new User({
                username : req.body.username,
                password : hash
            });
            newUser.save(function(err) {
                if(err){
                    console.log(err);
                }else{
                    res.render('secrets');
                }
            });
        });        
    });

//////////////////////////////////////////////----------    /login

app.route("/login")
    .get(function(req,res){
        res.render("login");
    })
    .post(function(req,res){
        const username = req.body.username;
        const password = req.body.password;
        User.findOne(
            { username : username},
            function(err,foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result){
                        res.render("secrets");
                    }else{
                        res.send("<h1>Wrong Password!</h1>")
                    }
                });
            }
        );
    });
        
/////////////////////////////////////////////-----------    



app.listen(3000, function(){
    console.log("Server is running in port 3000");
});