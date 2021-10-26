const jwt=require("jsonwebtoken");
//exporting user from schema.js 
const userRegister=require("../models/schema.js");
//defining auth function which we wil use in app.js
//next is keyword 
//if we wil not use next() then it will stuck into this function
//and will never get out from auth function or next step
//to run next we after auth function we have to use next()
//untill user has authorized login detail with authrized token they
//cant access authorized page
const auth=async(req,res,next)=>{
try{
    //getting cookie which has name loginCookie anh having token on login
    //we will get this token in token variable
    //when we are setting req.cookies.logincookie that means we will get 
    //the one cokkie after login page bcz we are storing it after login
const token=req.cookies.loginCookie24;
//it is verifying token which we have stored on login page as a cookies
//is matching with the our secretkey if its matching then it will show 
//user secret page
const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
console.log(token);
console.log(process.env.SECRET_KEY)
//jwt.verify() returns oject id will return id
console.log("verify user = "+verifyUser);
//if id is presnet in database then all data will show  
const user=await userRegister.findOne({id:verifyUser});
console.log(user);
console.log(user.name);

next();

}
catch(err){
res.status(401).send(err);
}
}

//Export auth function and using thier in secret page routing
module.exports=auth;
