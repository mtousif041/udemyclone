import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import {Lecture} from "../models/lecture.model.js"
import {User} from "../models/user.model.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); //yha pr hum ek nya instance/object create kr rahe hai 

export const createCheckoutSession = async (req, res)=>{
    try {
        const userId = req.id
        const {courseId} = req.body;// isko hum params se nhai balki body se hi bhejenge 

        const course = await Course.findById(courseId)

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }

        //agr course mil jata hai  to create a new course purchase record
        const newPurchase = new CoursePurchase({
            courseId,
            userId,
            amount:course.coursePrice,
            status:"pending"
        });


        //create a stripe checkout session 
         // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: course.courseTitle,
                images: [course.courseThumbnail],
              },
              unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful done then redirect to course progress page
        // cancel_url: `http://localhost:5173/course-detail/${courseId}`,
        cancel_url: `http://localhost:5173/course-detail/${courseId}`, // agr pymnt failed ho gya to fir se detail page pr bhej dhenge 
        metadata: {
          courseId: courseId,
          userId: userId,
        },
        shipping_address_collection: {
          allowed_countries: ["IN"], // Optionally restrict allowed countries
        },
      });
  
      if (!session.url) {
        return res
          .status(400)
          .json({ success: false, message: "Error while creating session" });
      }
  
      // Save the purchase record
      newPurchase.paymentId = session.id;
      await newPurchase.save();
  
      return res.status(200).json({
        success: true,
        url: session.url, // Return the Stripe checkout URL
      });
    } catch (error) {
      console.log(error);
    }
  };



  //stripe web hook 
  export const stripeWebhook = async (req, res) => {
    let event;
  
    try {
      const payloadString = JSON.stringify(req.body, null, 2);
      const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
  
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret
      });
  
      event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
      console.error("Webhook error:", error.message);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

  
    // Handle the checkout session completed event 
    if (event.type === "checkout.session.completed") {//checkout.session.completed yha pr alag alag event hote hai completed,failed,fulfill aise alag alag hote hai  
      console.log("check session complete is called");
  
      try {
        const session = event.data.object;
  
        const purchase = await CoursePurchase.findOne({
          paymentId: session.id,
        }).populate({ path: "courseId" });
  
        if (!purchase) {
          return res.status(404).json({ message: "Purchase not found" });
        }
  
        if (session.amount_total) {
          purchase.amount = session.amount_total / 100;
        }
        purchase.status = "completed";
  
        // Make all lectures visible by setting `isPreviewFree` to true
        // ab agr user ne kisi course ko purchase kr liy ahai to uske saare lecture ko free kr dunga 
        if (purchase.courseId && purchase.courseId.lectures.length > 0) {
          await Lecture.updateMany( // aur yha pr Lecture schema/model ko ab update krenege bahuut sare lecture krne hai isliye updateMany
            { _id: { $in: purchase.courseId.lectures } },
            { $set: { isPreviewFree: true } }
          );
        }
  
        await purchase.save();
  
        // Update user's enrolledCourses
        await User.findByIdAndUpdate(
          purchase.userId,
          { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
          { new: true }
        );
  
        // Update course to add user ID to enrolledStudents
        await Course.findByIdAndUpdate(
          purchase.courseId._id,
          { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents , yaani ki konse student ne enrolled kr rhkha hai uski id daal dhenge 
          { new: true }
        );
      } catch (error) {
        console.error("Error handling event:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    res.status(200).send();
  };



  ///ab ek controller bnana hai jo ek course dega apne ko jo course purchesd hai 
  export const getCourseDetailWithPurchaseStatus = async (req, res)=>{
    try {
      const {courseId} = req.params;
      const userId = req.id;

      const course = await Course.findById(courseId).populate({path:"creator"}).populate({path:"lectures"});

      //ab agr course mil jaayega to ye bhi check kreneg ki user ne course purchase kiya hai ki nhai 
      const purchased = await CoursePurchase.findOne({userId, courseId}) // hum ye check kr rhe hai ki CoursePurchase me userId aur courseId hai ki nhai , aagr hai to means ki is user ne is course ko purcahse kiy hai

      //agr course nhai hota hai to 
      if(!course){
        return res.status(404).json({
          message:"Course not found"
        })
      }

      return res.status(200).json({
        course,
        purchased: purchased ? true : false // agr purchased hota hai to hum purchased me true bhejnege nhai to false bhejnege 
        // purchased: !!purchased; //aap aise bhi likh shaakte ho uper wale ko dono same hi hai 

      })

    } catch (error) {
      console.log(error);
      
    }
  }



  ////////////ab ek aur controller bna lete hai knyuki humko jo bhi purchased course hai un sabko dashboard me display krne honge baad me 
  export const getAllPurchasedCourse = async (req, res)=>{
    try {
      const purchasedCourse = await CoursePurchase.find({status:"completed"}).populate("courseId") // yaani jiska status completed ho vo find krna hai aur sath hi usme se courseId ko bhi populate krna hai

      if(!purchasedCourse){
        return res.status(404).json({
          purchasedCourse:[]
        })
      }

      return res.status(200).json({
         purchasedCourse
      })
    } catch (error) {
      console.log(error);
      
    }
  }