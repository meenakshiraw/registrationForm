const mong=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const rschema=new mong.Schema({
    firstName:{
        type:String,
        required:true,

    },
    lastName:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
    
       
    },
    gender:{
        type:String,
        required:true,
        
       
    },
    phoneNo:{
        type:Number,
        required:true,
       
       
    },
    age:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
     
    },
    confirmPassword:{
        type:String,
        required:true,
      
    },
    //this new token field we are adding to schema bcz we want 
    //token generated to add in database
    tokens:[{
        token:{
            type:String,
        required:true,
      
        }
    }]
})



rschema.methods.generateAuthToken=async function(){
try{

    //if we have to use secret code then we will write as 
    //process.env.secret_Key .we have to defined the key which we wrote
    //in the .env file after writig process.env
    //make sure ypu have required in pp.js page
const token= await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);

console.log(token);


this.tokens=this.tokens.concat({token});

//saving tokens in database save and save() gives back await
await this.save();



return token;

}
catch(err){
    console.log("the error is " + err);
}
}

rschema.pre("save",async function(next){
  
    
if(this.isModified("password")) {
    
    
 console.log(`current password before hashing ${this.password}`);

 this.password=await bcrypt.hash(this.password,10);
    console.log(`hashed password ${this.password}`);
    //earlier we had defined confirmPassword as undefined now we have declare
    //it is a hashed password now stored in database
    this.confirmPassword=await bcrypt.hash(this.confirmPassword,10);
   
    

    
  } 

 next();

})
//creating collection
const user=new mong.model("UserRegisteration",rschema);
module.exports=user

