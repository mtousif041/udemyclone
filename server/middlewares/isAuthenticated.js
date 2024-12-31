// isAuthenticated means ki vo loggedIn hai ki nhai 

import jwt from "jsonwebtoken"

const isAuthenticated = async (req, res, next)=>{
    try {
        const token = req.cookies.token; // check krnge ki user login hai ki nhai 
        if(!token){
            return res.status(401).json({
                message:"User not authenticated",
                success:false
            })
        }

        // ab agr token hota hai to hum usko verify krenge secret key se 
        const decode = await jwt.verify(token, process.env.SECRET_KEY)

        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            }) 
        }
    //   req.id yaani mene ek req.id naam ka ek variable bnaya hai 
        req.id = decode.userId;  // decode.userId yaani ye vo user id hai jo mene generateToken.js ke ander save kri thi 


        next();
    } catch (error) {
        console.log(error);
        
    }
};


export default isAuthenticated;