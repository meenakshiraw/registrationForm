const mong=require("mongoose");
mong.connect("mongodb://localhost:27017/youtubeRegistration",{
    useNewUrlParser: true,
    useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false
}).then((r)=>{
    
    console.log("mongo db is connected succesfully")
    }).catch((err)=>{
        console.log(err);
    })