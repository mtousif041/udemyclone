import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./database/db.js";
import userRoute from "./routes/user.route.js";
import mediaRoute from "./routes/media.route.js"
import courseRoute from "./routes/course.route.js"
import purchaseRoute from "./routes/purchaseCourse.route.js"
import courseProgressRoute from "./routes/courseProgress.route.js"


import cors from "cors"

dotenv.config({});

// call data base connection 
connectDb()

const app = express();

const PORT = process.env.PORT || 3000;

//default middleware
app.use(express.json()); // agr tum ise nahi likhoge to yha pr req.body as it is undefined aayega 
app.use(cookieParser()); //ye cookies ko set krne ke liye ek middleware hai 
app.use(cors({
    origin:"http://localhost:5173", // frontend url 
    credentials:true ///yha pr credentials hi  hona chaye naki credential 
}))

// saare apis ke end points yha create krenge 
app.use("/api/v1/user", userRoute); // ye ek middle ware ki traha hai 
// http://localhost:8080/api/v1/user/register

app.use("/api/v1/course", courseRoute);

app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.listen(PORT, ()=>{
    console.log(`server listen on port ${PORT}`);
    
})