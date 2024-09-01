const mongoose = require("mongoose") ;

const postSchema = mongoose.Schema({
    postImage:String ,
    caption : String ,
    createdAt : {
        type:Date ,
        default: Date.now
    } ,
    user:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"Users"
    }
});

module.exports = mongoose.model("Posts",postSchema)