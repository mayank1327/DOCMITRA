if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
   };

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const mongo_url = 'mongodb://127.0.0.1:27017/DocMitra';

const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname , "views"));

const ejsMate = require("ejs-mate");
 app.engine("ejs",ejsMate);

 app.use(express.urlencoded({extended:true}));

 app.use(express.static(path.join(__dirname,"/public")));
//  app.use(express.static(path.join(__dirname,"/Assest")));

 const wrapAsync = require("./utils/wrapAsync.js");
 const ExpressError = require("./utils/ExpressError.js");


 const methodOverride = require("method-override");
 app.use(methodOverride("_method"));

 const User = require("./models/user.js");
 const session = require("express-session");
 const MongoStore = require('connect-mongo');
 const flash = require("connect-flash");

 const passport = require("passport");
 const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("./middleware.js");

main()
 .then(()=>{
    console.log("connected to Db");
 }).catch((err)=>{
    console.log(err)
 });

 async function main(){
   await mongoose.connect(mongo_url);
 };

 const store = MongoStore.create({
    mongoUrl: mongo_url,
    crypto: {
      secret:process.env.SECRET
    },
    touchAfter: 24*3600,
   });
  
   store.on("error",()=>{
    console.log("error is occur", err);
   })

 const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    }
   }

 app.use(session(sessionOption));
 app.use(flash());

 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));

 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

 app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
   });

 
 app.get("/DocMitra/login",(req,res)=>{
    res.render("patient/login.ejs");
});
app.post("/DocMitra/login",(req,res)=>{
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
}),
req.flash("success","welcome back to wanderlust you're logged in");
res.render("/patient/dashboard.ejs")
})

app.get("/DocMitra/register",(req,res)=>{
   res.render("patient/register.ejs");
});

    
    
app.post("/DocMitra/register",wrapAsync( async(req,res)=>{
    try{
        let {username, age, gender, state , email,password} = req.body;
        const newUser = new User({username, age, gender, state, email, password});
     let registeredUser =  await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
          if(err){
            return next(err);
        } 
          req.flash("success", " successful registered");
          res.render("/patient/index.ejs");
        })
    }
        catch(e) {
          req.flash("error", e.message);
        //   res.redirect("/patient/register.ejs")
         }
        } )     
        );



app.get("/DocMitra/register/Doctor_register",(req,res)=>{
    res.render("patient/DrRegister.ejs");
});
app.post("/DocMitra/register/Doctor_register",(req,res)=>{
    res.render("patient/Drdashboard.ejs");
});


app.get("/logout",
(req,res,next)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success","you are logged out !!");
        res.redirect("/docMitra");
    })
 })



app.get("/DocMitra/About",(req,res)=>{
    res.render("navigation/About.ejs");
 })

 app.get("/DocMitra/Resource",(req,res)=>{
    res.render("navigation/Resource.ejs");
 })

 app.get("/DocMitra/Wws",(req,res)=>{
    res.render("navigation/Whoweserve.ejs");
 })
 app.get("/DocMitra/Helpline",(req,res)=>{
    res.render("navigation/Helpline.ejs");
 })
 app.get("/DocMitra/Support",(req,res)=>{
    res.render("navigation/Support.ejs");
 })

 


app.get("/DocMitra",(req,res)=>{
    res.render("patient/index.ejs");
});

app.all("*",(req,res,next)=>{ 
    next(new ExpressError(404,"page not found!!"));
   })

app.use((err,req,res,next)=>{
    let {status=301,message="something went wrong"} = err;
      res.status(status).render("./patient/error.ejs",{message})
  });


app.listen(8080,()=>{
    console.log("server is running on port")
})





