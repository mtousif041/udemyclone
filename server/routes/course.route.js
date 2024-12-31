import express from "express";
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourse, removeLecture, searchCourse, togglePublishCourse } from "../controllers/course.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js"

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/published-courses").get( getPublishedCourse); // isko bhi rtk query me use kr lenge 
router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/:courseId").put(isAuthenticated, upload.single("courseThumbnail")  ,editCourse); // isko bhi courseApi.js me integretae kr dhenge 
router.route("/:courseId").get(isAuthenticated ,getCourseById); // isko bhi courseApi.js me integretae kr dhenge 
router.route("/:courseId/lecture").post(isAuthenticated ,createLecture); 
router.route("/:courseId/lecture").get(isAuthenticated ,getCourseLecture); // used in courseApi.js 
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated ,editLecture); // used in courseApi.js 
router.route("/lecture/:lectureId").delete(isAuthenticated ,removeLecture); // used in courseApi.js 
router.route("/lecture/:lectureId").get(isAuthenticated ,getLectureById); // used in courseApi.js 

// route for published and unpublished
router.route("/:courseId").patch(isAuthenticated ,togglePublishCourse); // used in courseApi.js 
// humne isme put methode ko use kiya tha but ye aur 3rd route same hone ke karan ye issue kr rha tha to humne put ki patch use kr liya , patch kab use krte hai jab aapko koi minor cheez update krni hoti hai 



export default router;