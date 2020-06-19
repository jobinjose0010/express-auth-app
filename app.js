var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    User = require("./models/user"),
    LocalStatergy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');
const user = require('./models/user');


mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();
app.set('view engine','ejs');

app.use(require("express-session")({
    secret:"This is a node authentication app",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>res.redirect("/home"));

app.get("/home",(req,res) => res.render("index"));

app.get("/login",(req,res)=> res.render("login"));

app.get("/signup",(req,res)=> res.render("signup"));

app.post("/signup",function(req,res){ 
    req.body.username,
    req.body.password,
    User.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("/signup");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/dashboard");
        });
    });
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/dashboard",
    failureRedirect:"/login",
}),function(req,res){
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.get("/dashboard",isLoggedIn,(req,res)=> res.render("dashboard"));


app.listen(process.env.PORT,process.nextTick.IP,function(){
    console.log("Server started sucessfully!");
})