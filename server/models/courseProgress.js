import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
    lectureId:{type:String},
    viewed: { // iska matlab yhe hoga ki yhe dheka gya hai ki nhai 
        type:Boolean,
    },
});


const courseProgressSchema = new mongoose.Schema({
    userId:{type:String},
    courseId:{type:String},
    completed:{type:Boolean}, //jab saare lecture complette ho jayenge tab course completed true ho jaayega 
    lectureProgress:[lectureProgressSchema], //lectureProgressSchema schema ko hum yahi pr use kr lenge 
});


export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema)
