import {v2 as cloudinary} from "cloudinary";

import dotenv from "dotenv";

dotenv.config({});

cloudinary.config({
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
    cloud_name:process.env.CLOUD_NAME,
});

export const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type:"auto" // resource_type yaani photo hoga ya video hoga , humne auto krdiya jo bhi hoga vo le lega 

        });
        return uploadResponse;
    } catch (error) {
         console.log(error);
         
    }
}


/////////////////ab delete ke liye likh lenge , yaani jab new photo upload hogi to purani wali ko delete kr dhenge taki cloudinary me faltu ka space na le 
// publicId means ki cloudinary me tumhara jitna bhi media hota haina to har ek ka public id hota hai 
export const deleteMediaFromCloudinary = async (publicId)=>{
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
         console.log(error)
    }
};


// ab video delete ke liye bhi bna lete hai 
export const deleteVideoFromCloudinary = async (publicId)=>{
    try {
        await cloudinary.uploader.destroy(publicId, {resource_type:"video"});
    } catch (error) {
        console.log(error);
        
    }
}