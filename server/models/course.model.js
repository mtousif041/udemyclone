import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        require:true
    },
    subTitle:{
        type:String,
        
    },
    description:{
        type:String,
    
    },
    category:{
        type:String,
        require:true
    },
    courseLevel:{
        type:String,
        enum:["Beginner", "Medium", "Advance"]
    },
    coursePrice:{
        type:Number,
    },
    courseThumbnail:{
        type:String,
    },
    enrolledStudents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    lectures:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lecture'
    }],
    creator:{ // yha aaray nhai aayega kynuki ek course ko ek hi creato create kr shakta hai 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isPublished:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

export const Course = mongoose.model("Course", courseSchema);