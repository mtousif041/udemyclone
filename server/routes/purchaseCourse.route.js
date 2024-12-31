import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, stripeWebhook } from "../controllers/coursePurchase.controller.js";


const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession );
router.route("/webhook").post(express.raw({type:"application/json"}), stripeWebhook );
router.route("/course/:courseId/detail-with-status").get(isAuthenticated, getCourseDetailWithPurchaseStatus );// isme isAuthenticated true hona chaye tab hi aapko req.id se user ki id milegi 
router.route("/").get(isAuthenticated, getAllPurchasedCourse);

//aur in route ko bhi hum purchaseApi.js me bna lenge frontend me



export default router;