// require dotenv should have to be in begenning
const dot=require('dotenv').config();
const express=require("express");
const app=express();
const path=require("path");
//importing auth from auth.js page and using as a argument in secret page routing
const auth=require("./middleware/auth");
//requiring cookieParser and use as middleware
const cookieParser=require("cookie-parser");
const hbs=require("hbs");
const port=process.env.PORT||4001;
//using bCrypt after downloading bcrypt package
const bcrypt=require("bcryptjs");
const templatepath=path.join(__dirname,"../templates/views");
app.set("views",templatepath);
app.set("view engine","hbs");
const staticpath=path.join(__dirname,"../public");
app.use(express.static(staticpath));
const partialsPath=path.join(__dirname,"../templates/partials");
hbs.registerPartials(partialsPath);

require("./db/cone.js");
 const userRegister=require("./models/schema.js")
 //for generating jwt token
 const jwt=require("jsonwebtoken");

app.use(express.json());
//the parser which we require are passed in the below as a function and use it

app.use(cookieParser());
//getting form data we tell 
app.use(express.urlencoded({extended:false}));

//printing our secret key
console.log("printing our secret key ="+process.env.SECRET_KEY);
app.get("/",(req,res)=>{
    res.render("index");
})
//showing our secret page only if user is guniune if its not guiniune 
//then it wont show their secret page after login page
//here we are giving auth functionpassin as a argument which we have aquired by requre
//which we have declared in auth.js.the auth  function is verifying cookies token
//with the secret key which is stored in server database if both matches
//then only secret page will show after login page

//we are using auth middleware where we authencating user before showing 
//our secret page or running next step here we are consoling login cookie

//giving form html page
app.get("/register",(req,res)=>{
    res.render("rform");
})

app.post("/register",async(req,res)=>{
   const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
  try{
    if(password==confirmPassword){
       
      
      const userData=new userRegister({
        firstName:req.body.firstname,
        lastName:req.body.lastname,
        email:req.body.email,
          phoneNo:req.body.phoneNo,
          age:req.body.age,
          gender:req.body.gender,
          password:req.body.password,
          confirmPassword:req.body.confirmPassword
          
      })
   
   const token=await userData.generateAuthToken();
      console.log(userData);
      const userSave=await userData.save();
   console.log(userSave);
   
   
  res.cookie("jwt2",token,{
 
expires:new Date(Date.now()+30000000),
    //http:true is says the client server which is javascript now cant do
    //any alteration to the cookies.it cant be deleted or changed;
    httpOnly:true
  });

      res.status(201).send(userSave); 
    }
      
     //if it doesnt save then it get into catch and will give 
     //404 error page 
      else{
        res.status(404).send("password doesnt match");
      }

    }
    catch(err){
        res.status(404).send("error in the page "+err);
    }

})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.post("/login",async(req,res)=>{
  //theses are password which are filled by user in login form
  //we are taking it in email and pwd
    const email=req.body.email;
    const pwd=req.body.password;
 try{
 //consoling entered email and pasword by user
console.log(`email is ${email} and password ${pwd}`);

const useremail=await userRegister.findOne({email:email});


//after matching password we are adding here middleware where 
//we are just calling generateAuthToken() function here which we have defined in
//schema and regitered a token with it.here also by calling this method we will
//register jwt token with login
const token=await useremail.generateAuthToken();
console.log("token is ="+token);  
const isMatch=await bcrypt.compare(pwd,useremail.password);
console.log(isMatch);
//cokies have to use after comparing password and genrating token so that 
//token we can store
res.cookie("loginCookie24",token,{expires:new Date(Date.now()+3000000),
httpOnly:true
})

//if it is match then it will show this 

if(pwd==useremail.password){
    console.log("it is matched");
res.status(201).send("page is open");
}
else{
    res.status(404).send("invalid username and password");
}
 }
 catch(err){
 //if wrong email id is filled then it will show error and enter into catch block
 //show this error
    res.status(404).send("Invalid login details" +err);
    
 }
})


app.get("/secret",auth,(req,res)=>{

  // console.log(`cookies are using ${req.cookies.loginCookie}`)
  res.render("secret");
})
//when user logout we will givE some functionality or define some function
//which we will give as a middleware
app.get("/logout",auth,(req,res)=>{

 
  
  res.render("secret");
})


app.listen(port,()=>{
    console.log(`listning to the ${port}`)
})