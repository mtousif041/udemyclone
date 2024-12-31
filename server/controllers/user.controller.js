import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import upload from "../utils/multer.js";


////////////////////////for register//////////////////////////////////////
export const register =  async (req, res)=>{
  try {
    const {name, email, password} = req.body; // ye name, email, password frontend se aayenge to ye frontend ke same hi hone chaye spelling same 

    // ab check krenge ki inme se agr ek bhi field miss hai to kiya krna hai 
    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message: "All fields are required"
        })
    }

    // ab check krenge ki same email phele se exist to nhai krti hai 
    const user = await User.findOne({email});

    if(user){
        return res.status(400).json({
            success:false,
            message:"user already exist with this email",
        })
    }

    // password ko hased krenge 
    const hashedPassword = await bcrypt.hash(password, 10); // 10 ek default salt number hai 

    // agr user nhai milta hai to aage procced krenge yaani user ko ab create krvayenge 
    await User.create({ // jo jo cheeje humne required ki hai vo cheeze bhejna jaroori hota hai 
       name,
       email,
       password:hashedPassword
    }); 

    // ab user create hote hi hum message vgera return kr dhenge ki user create ho chuka hai 
    return res.status(201).json({
        success:true,
        message:"Account created successfully"
    })

  } catch (error) {
    console.log(error);
     return res.status(500).json({
        success:false,
        message:"Failed to register"
     })
  }
}



/////////////////////////for Login //////////////////////////////////
export const login = async (req, res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "All fields are required"
            })
        }

        // ab check krenge ki user id exist kr rhai hai ki nahi agr id nhai hogi to login kese hoga
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password",
            })
        }


        // ab databse wale hased password aur jo user ne password enter kiye hai usko metched krenge 
        const isPasswordMatch = await bcrypt.compare(password, user.password) // ye user.password ye database wala password hai 
        // agar password matched ho jata hai to  isPasswordMatch ki value true ho jaayegi 
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password",
            }) 
        }


        //ab token generate krna hai knyuki hum authentication krnege yaani agr ek baar user ne login kr liya hai to fir vo login hi rhena chaye yaani usko baar baar login na krna pde,  ya check krenge ki user login hai ki nhai kisi kaam ko krne ke liye 
        // generateToken function ko hum dusri file me bna lete hai 
        generateToken(res, user, `Welcome back ${user.name}`);


    } catch (error) {
        console.log(error);
     return res.status(500).json({
        success:false,
        message:"Failed to Login"
     })
    }
}


///////////////////for logout 
export const logout = async (req, res)=>{
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged Out succesfully",
            success:true
        })
    } catch (error) {
        console.log(error);
     return res.status(500).json({
        success:false,
        message:"Failed to Logout"
     })
    }
}


///////////////////for user ki profile get krne ke liye 
export const getUserProfile = async (req, res)=>{
    try {
        // user ki profile usko tab hi dikegi jab vo logged in hoga , to iske liye hum ek middleware use krenge is authenticated
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");

        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }

        // agr ab user hai to usko return kr dhenge
        return res.status(200).json({
            success:true,
            user // aur user bhi return kr dhenge 
        })

        // ab getUserProfile ko frontend me jaker check kr lete hai ki chal rha hai ki nhai 

    } catch (error) {
        console.log(error);
     return res.status(500).json({
        success:false,
        message:"Failed to load user"
     })
    }
}


/////////////////////////user ki profile edit krne ke liye 
export const updateProfile = async (req, res)=>{
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({
                message:"user not found",
                success:false
            })
        }

        // extract the publicId of old image from the url if it exist 
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0]; //t7otvbiqllsysqklksmx, yehi public id hai jo ki database url me lasst me hoti hai 
            //ab public id ko call krunga 
            // console.log(publicId);
            // console.log("//////////////////////////////////////////");
            // console.log( user.photoUrl.split("/").pop().split(".")[0]);
            // console.log("//////////////////////////////////////////");
            
            // console.log( user.photoUrl.split("/").pop().split("."));
            // console.log("//////////////////////////////////////////");
            // console.log( user.photoUrl.split("/").pop());
            // console.log("//////////////////////////////////////////");
            // console.log( user.photoUrl.split("/"));
            // console.log("//////////////////////////////////////////");
            
            
            deleteMediaFromCloudinary(publicId);
        }

        // ab purane wale ko destroy krne ke baad me nya photo upload krunga 
        const cloudResponse = await uploadMedia(profilePhoto.path);
        // console.log(profilePhoto.path);
        

        // ab cloud response ke ander apko ek url milega 
        const photoUrl = cloudResponse.secure_url;


        //ab agr user mil jata hai to uski profile ko update karunga 
        const updatedData = {name, photoUrl}
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password") // updatedData means ki update kiya krna hai , {new:true} yaani new:true krdena taaki saari cheeje mere ko updated dhike 

        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile updated successfully."
        })    //////////////////////////////ab isko bhi authApi.js  ke ander use kr lenge frontend me 

    } catch (error) {
        console.log(error);
        return res.status(500).json({
           success:false,
           message:"Failed to update profile"
        })
    }
}