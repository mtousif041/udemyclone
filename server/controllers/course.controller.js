import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {deleteMediaFromCloudinary, uploadMedia} from "../utils/cloudinary.js"

export const createCourse = async (req, res)=>{
    try {
        const {courseTitle, category } = req.body;

        if(!courseTitle || !category){
            return res.status(400).json({
                message:"Course title and category are required"
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator:req.id
        });

        return res.status(201).json({
            course,
            message:"Course created"
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to create Course",
        })
    }
}


/////////////
export const searchCourse = async (req, res)=>{
    try {
        //search kiske basis pr krega, yaani jobhi vo query type krega 
        const {query="", categories=[], sortByPrice=""} = req.query;
        //agr req.body me se milti hai to thik hai verna ye "", [], "" le lenge 
        
        // create a search query 
        const searchCriteria = {
            isPublished:true, //yaani mere ko sirf vo course search krne hai jo published honge 
            $or:[ // or oprator isliye lgaya ki agr inme se ek me bhi milta hai to 
                {courseTitle: {$regex:query, $options:"i"}}, //ye course title ke basis pr find krega 
                {subTitle: {$regex:query, $options:"i"}}, //ye subtitle ke basis pr find krega 
                {category: {$regex:query, $options:"i"}}, //ye subtitle ke basis pr find krega 
            ]
        }

        /// if categories selected
        if(categories.length > 0){
            searchCriteria.category = {$in: categories};
        }

        ///now for sorting selected
        const sortOptions = {};
        if(sortByPrice === "low"){
            sortOptions.coursePrice = 1;//sort by price in ascending order
        }else if(sortByPrice === "high"){
            sortOptions.coursePrice = -1;//sort by price in discending order
        }

        //ab hum yha pr courses ko find krenege
        let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions); //yaani searchCriteria ke basis pr find krenge 

        return res.status(200).json({
            success:true,
            courses: courses || [], //yha pr agr courses hota hai to courses daal dhenge varna empty array daal dhenge 

        })
         
    } catch (error) {
        console.log(error);
        
    }
}
/////////////////////////////////////////////////////


// for fetching/get course jo ki created hai databaase me ek specific user ke duara
export const getCreatorCourses = async (req, res)=>{
    try {
        //courses ko get krne se phele mere ko user ki id pta honi chaye 
        const userId = req.id;
        const courses = await Course.find({creator:userId}); //creator, database me yehi name save hai , yaani jis bhi creator ki id ye ho uske saare course ko fetch krna hai 

        if(!courses){
            return res.status(404).json({
                courses:[], // agr courses nhai milte to me yha pr empty array daal dhunga 
                message:"Course not Found"
            })
        };

        //agr courses mil jaate hai to hum ye krenge 
        return res.status(200).json({
            courses,
        })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to fetching Course",
        })  
    }
} // ab isko bhi course.route.js me add kr dhenge 



/// ab update course ke liye bhi api bna lenege 
export const editCourse = async (req, res)=>{
    try {
        const courseId = req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;

        // ab course ko update karunga 
        let course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message:"Course Not Found"
            })
        }

        // ab aggr course mil jata hai to usko update krdenge aur agr thumbnail bhi phele se upload hai aur agr nya thumbnail dalna hai to phle purane wale ko delete krna pdega
        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){ //yaani database ke course me courseThumbnail hota hai to uski public id nikal lenge destroy krne ke liye 
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0]; // isse publicId mil jaayegi 
                await deleteMediaFromCloudinary(publicId); // delete old image 

            }
            // thumbnail ko upload bhi krna hai cloudinary pe 
            courseThumbnail = await uploadMedia(thumbnail.path);
        }


        // ek single variable ke ander hum apna saara data le lenge jisko bhi update krna hai 
        const updateData = {courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail:courseThumbnail?.secure_url};
        // ye secure_url cloudinary aapko de rha hai 

        course = await Course.findByIdAndUpdate(courseId, updateData, {new:true});

        return res.status(200).json({
            course,
            message:"Course updated successfully."
        })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to update Course",
        })  
    }
}


// ab jab course ko edit krne jaayenge icon pr click krkr to us form me data phele se fill aaye agr data usme phele se ho to 
export const getCourseById = async (req, res)=>{
    try {
        // const courseId = req.params.courseId // aise bhi likh shakte ho
        const {courseId} = req.params // aise bhi likh shakte ho

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }

        // ab agr course milta hai to 
        return res.status(200).json({
            course // yha pr course return kr diya 
        })
        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to get Course by id",
        })   
    }
}



/////yha pr lectureSchema ka controller likha hai humne lecture ko create krne ke liye 
export const createLecture = async(req, res)=>{
    try {
        const {lectureTitle} = req.body; // kevel yehi ek field hai jo humne schema me required true kiya hai 

        //yha pr mere ko course id bhi chaye knyuki hum ek course ke ander bahoot saare lecture add krenege jissse ye pta chalega ki is course me kon konse lecture hai , aur har course ke ander humne ek lectures aaray bhi banaya hai 
        const {courseId} = req.params;
        
        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title and course id is required"
            })
        };

        // create Lecture 
        const lecture = await Lecture.create({lectureTitle}); //isse lecture create ho jaayega 

        //jab lecture create ho jaayega to is lecture ko mere ko ek specific course me puss krna hai course ki id ke duuaara 
        const course = await Course.findById(courseId);

        if(course){
            course.lectures.push(lecture._id);//is trha se hum course ke ander lectures field me lecture ko add kr dhenege
            await course.save()//isse save ho jaayega yaani ab mere ko apdated data dhikega 
        }

        return res.status(201).json({
            lecture,
            message:"Lecture created succesfully"
        });

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to Create Lecture",
        })   
    }
}// ab isko bhi courseApi.js me bna lenge 




//ab jese hi hum lecture create krte jaaynge unko wapas usme niche dhikha bhi hai ki kon konse lecture humne lecture create kiye hai ek particular course ke liye 
export const getCourseLecture = async (req, res)=>{
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        // ab iske baad mere pass jo course aayega usme jo lectures hoga uske ander lecture ka actuall data hoga jese courseTitle, aur bhi jo hoga vo 
        if(!course){
            return res.status(404).json({
                message:"Course not found",
                
            })
        }

        return res.status(200).json({ //isse mere ko saare lectures mil jaaynege 
            lectures:course.lectures
        });


    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to get Lectures",
        })   
    }
}


///for LecturTab.jsx yaani update lecture ke liye
export const editLecture = async (req, res)=>{
    try {
        const {lectureTitle,videoInfo, isPreviewFree} = req.body;
        const {courseId, lectureId} = req.params
        // ek bar jab id mil jayegi to hum find krnge lecture 
        const lecture = await Lecture.findById(lectureId)

        // agr lecture nhai milta hai to 
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found"
            })
        }

       ////////////////////////////////////////// // ab agr lecture mil jata hai to hum lecture ko update krenge 
        if(lectureTitle) lecture.lectureTitle = lectureTitle; //lecture.lectureTitle yaani iske ander jo nya lecture lectureTitle aaya hai usko daal dunga 
        if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        if(isPreviewFree) lecture.isPreviewFree = isPreviewFree;
        //////////////////////////////////////////////////////////////////////////////

        await lecture.save();

        // ab hum kiya krenge ki jis bhi lecture ko upddate krenge uske ke baad, ab hum course me lectures[] me lecture ki id ko add krenge 
        const course = await Course.findById(courseId)
        if(course && !course.lectures.includes(lecture._id)){// yaani ki agr course me lecture phele se hai to usko add nhai krenge agr nhai hai to add kr dhenge 
          course.lectures.push(lecture._id)
          await course.save()
        }
         
        return res.status(200).json({
            message:"Lecture updated successfully",
            lecture
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to edit Lecture",
        })    
    }
}


//// video lecture uploade krne wale page me jo remove lecture hai uske liye 
export const removeLecture = async (req, res)=>{
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);

        // delete hone ke baad ye return bhi krta hai lecture ko , to agr lecture ab not found hota hai to 
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found"
            })
        }

        // ab jo lecture mene delete kiye hai to uska video bhi cloudinary se delete karunga 
        if(lecture.publicId){
          await deleteMediaFromCloudinary(lecture.publicId)
        }

        //// ab course ke lectures[] array me si bhi usko delete krunga 
        await Course.updateOne({lectures:lectureId},// find the course that contains  the lecture ,yaani hum vo wala course find kr hre hai jiske ander is lecture ki id hai 
            {$pull:{lectures:lectureId}} // isse is lectureId wala lecture delete ho jaayega 
        );

        return res.status(200).json({
            message:"Lecture removed successfully."
        })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to remove Lectures",
        })    
    }
}


////ab get lecture by id ke liye bhi bna lete hai
export const getLectureById = async (req, res)=>{
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);

        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found"
            })
        }

        //agr lecture mil jaayega to hum lecture ko return kr dhenge 
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to get Lecture by id",
        })    
    }
}




/////////////////////////////ab course ko publish and unpublished krne ka logic likhnege 
export const togglePublishCourse = async (req, res)=> {
    try {
        const {courseId} = req.params;
        const {publish} = req.query; // ye true ya false hoga 
        const course = await Course.findById(courseId)

        
        if(!course){
            return res.status(404).json({
                message:"course not found"
            })
        }

        //published status based on the query parameter
        course.isPublished = publish === "true"; 
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished"

        return res.status(200).json({
            message:`Course is ${statusMessage}`
        })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to publised/unpublished course",
        })   
    }
}


// ab jo bhi user ne coures published kiye hai keval unko home page pr show krna hai , our courses ke niche 
export const getPublishedCourse = async (req, res)=>{
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
        //populate({path:"creator", select:"name photoURL"}) yaani har course ke ander ek creator ki id hai usse hum user ka name aur photo ko populate kr lenge 
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }

        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Failed to get published courses",
        })   
    }
}