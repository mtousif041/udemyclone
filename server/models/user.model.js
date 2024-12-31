import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    role:{
        type:String,
        enum:["instructor", "student"],
        default:"student"
    },
    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId, // yaani hum user aur courses ke bich me relation create kr rhe hai 
            ref:'Course'
        }
    ],
    photoUrl:{
        type:String,
        default:""
    },

        
},{timestamps:true});


export const User = mongoose.model("User", userSchema);