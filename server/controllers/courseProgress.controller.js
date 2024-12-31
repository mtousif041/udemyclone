// for lecture progress  and course progrees complted or not 13:40:00
import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";

export const getCourseProgress = async (req, res)=>{
    try {
        const {courseId} = req.params;
        const userId = req.id; // ye userid muje isAuthenticated middleware se mil jaayega 

        //step 1 : fetch the user course progress
        let courseProgress = await CourseProgress.findOne({courseId, userId}).populate("courseId");
        //findOne({courseId, userId} yaani jis bhi CourseProgress me ye wali courseId, aur  userId  ho usko find krna hai . aur course id wale course ko populate krna hai 

        const courseDetails = await Course.findById(courseId).populate("lectures");

        if(!courseDetails){
            return res.status(404).json({
                message:"Course not found",
            })
        }

        // step 2 If no progress found , yaani ki agr abi tak progress start nhai hui hai , to us case me kiya retun krenge ki 
        //return course details with an empty progress 
        if(!courseProgress){
            return res.status(200).json({//aur yha pr hum khuch na khuch return kr rhe hai isliye 200 code diya hai 
                data:{ // yha pr json data return krenge isliye object me krenge 
                    courseDetails,
                    progress:[],
                    completed:false
                                      
                }
            })
        }

        //step-3  //agr progress hoga to 
        ///return the user's course progress along with course details
        return res.status(200).json({//aur yha pr hum khuch na khuch return kr rhe hai isliye 200 code diya hai 
            data:{ // yha pr json data return krenge isliye object me krenge 
                courseDetails,
                progress: courseProgress.lectureProgress,
                completed:courseProgress.completed

            }
        })


    } catch (error) {
        console.log(error);
        
    }
}


//////////////////ab update lecture progress  ke liye , hum ek lecture ke progress ko update kr shakte hai 
export const updateLectureProgress = async (req, res)=>{
    try {
        const {courseId, lectureId} = req.params;
        const userId = req.id; // ye isAuthenticated se mil jaayega 

        // fetch or create course progress
        let courseProgress = await CourseProgress.findOne({courseId, userId});

        if(!courseProgress){
            //if no progress exist , then create a new progress record, uske le courseProgress ko update kr dhenge 
            courseProgress =  new CourseProgress({
                userId,
                courseId,
                completed:false, // initally to ye false hi rhaega 
                lectureProgress:[] //empty array isliye knyuki hum fresh new record create kr rhe hai 
            });
            
        }

        // find the lecture progress in the course progress
        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture)=>lecture.lectureId === lectureId)
        // lecture.lectureId === lectureId yaani lecture ke ander jo lectureId hai agr vo bhar ke lectureId se match ho jaata hai to 

        if(lectureIndex !== -1){
            // -1 means ki agr lecture id exist hi nhai krega , aur humne -1 ka not nikala hai yaani agr already exist krega 
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        }else{
            //agr koi bhi lectureProgess usme nahi hota hai to else wala cahlega 
            //Add new lecture progress
            courseProgress.lectureProgress.push({
                lectureId,
                viewed:true
            })
        }

        //if alll lecture is complete  tab humko course ko complete krna hai 
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg)=> lectureProg.viewed).length; // isse pura length mil jaayega
        // filter ek aaray return krta hai , agr lectureProgress array me saare lecture viewed hai 

        const course = await Course.findById(courseId);

        if(course.lectures.length === lectureProgressLength){ // iska matlab ki saare lecture viewed hai 
            courseProgress.completed = true
        }

        await courseProgress.save();

        return res.status(200).json({
            message:"Lecture progress updated successfully"
        })
        
            } catch (error) {
                console.log(error);
                
            }
        };



        ///// ab hum mark as completed ye sub bnaynge 
        export const markAsCompleted = async (req, res)=>{
            try {
                const {courseId} = req.params;
                const userId = req.id;

                const courseProgress = await CourseProgress.findOne({courseId, userId});
                if(!courseProgress){
                    return res.status(404).json({
                        message:"Course progress not found"
                    })
                }

                // agr courseProgress mil jata hai to hum courseProgress ke ander jitne bhi lectureProgress jo bhi viewed hai unko true krenge , jisse course completed ho jaayega 
                courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed = true);
                courseProgress.completed = true;
                await courseProgress.save();
                return res.status(200).json({
                    message:"Course marked as completed"
                })
            } catch (error) {
                console.log(error);
                
            }
        } 



        
        ///// ab hum mark as InCompleted ye sub bnaynge  // ye logic completed ke same hi hai bus name change kiya hai aur true ko false kiya hai 
        export const markAsInCompleted = async (req, res)=>{
            try {
                const {courseId} = req.params;
                const userId = req.id;

                const courseProgress = await CourseProgress.findOne({courseId, userId});
                if(!courseProgress){
                    return res.status(404).json({
                        message:"Course progress not found"
                    })
                }

                // agr courseProgress mil jata hai to hum courseProgress ke ander jitne bhi lectureProgress jo bhi viewed hai unko true krenge , jisse course completed ho jaayega 
                courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed = false); //************* */
                courseProgress.completed = false; //************** */
                await courseProgress.save();
                return res.status(200).json({
                    message:"Course marked as inCompleted"
                })
            } catch (error) {
                console.log(error);
                
            }
        } 
        
        