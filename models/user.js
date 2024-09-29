const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/Instagram") ;
const plm = require("passport-local-mongoose")
const userSchema = mongoose.Schema({
    username:{type:String , unique:true ,require:true},
    fullname:String ,
    email:String ,
    password:String ,
    profilePic:String ,
    posts:[{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"Posts"
    }] ,
    bio:String
}) ;

userSchema.plugin(plm) ;

module.exports = mongoose.model("Users" ,userSchema) ;