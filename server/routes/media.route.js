import express from "express"

import upload from "../utils/multer.js"
import { uploadMedia } from "../utils/cloudinary.js"

// ye video lecture ko upload krne ke liye hai 
const router = express.Router();

// file yaani jab hum frontend se bhejenge na to uska naam bhi file hi hona chaye yaani dono metch hona chaye 
router.route("/upload-video").post(upload.single("file"), async(req, res)=>{
    //humne basically function ko route ke ander hi bna diya 
    try {
        const result = await uploadMedia(req.file.path);

        // result milte hi isko return kr doonga 
        res.status(200).json({
            success:true,
            message:"File uploaded successfully",
            data:result,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error uploading file"})
        
    }
} ) 

export default router;