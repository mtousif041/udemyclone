import jwt from "jsonwebtoken"

export const generateToken = (res, user , message)=>{ // (res, user , message) ye teeno chije humne user.controller.js se bheji hai 
    const token = jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn:'10d'});

    return res.status(200).cookie("token",token, {httpOnly:true, sameSite:'strict', maxAge:10*24*60*60*1000}).json({
        success:true,
        message,
        user
    })

}