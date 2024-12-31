import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "http://localhost:8080/api/v1/purchase";

export const purchaseApi = createApi({
    reducerPath:"purchaseApi", // isme reducer path dena hota hai jo ki iske just uper wala hi name hai 
    baseQuery:fetchBaseQuery({
        baseUrl:COURSE_PURCHASE_API,
        credentials:"include"
    }),
    //ab iske baad mere ko end point bnane hai 
    endpoints:(builder)=>({
        createCheckoutSession:builder.mutation({
            query:(courseId)=>({
                url:"/checkout/create-checkout-session",
                method:"POST",
                body:{courseId}  // isko hum params se nhai balki body se hi bhejenge coursePurchase.controller.jsx me 

            })
        }),

        // yha pr getCourseDetailWithPurchaseStatus ke liye bhi bna lenge 
        getCourseDetailWithStatus:builder.query({
           query:(courseId)=>({
            url:`/course/${courseId}/detail-with-status`,
            method:"GET"
           })
        }),

        ///////ab getAllPurchasedCourse ke liye bna lete hai
        getPurchasedCourses:builder.query({
            query:()=>({
             url:`/`,
             method:"GET"
            })
         }),

    })
})

export const {useCreateCheckoutSessionMutation, useGetCourseDetailWithStatusQuery, useGetPurchasedCoursesQuery} = purchaseApi; // ab is purchaseApi ko mere ko rootReducer.js me bhi use krna pdega 
///////////////////////////////////////////
// useCreateCheckoutSessionMutation isko hum use krenge CourseDetail.jsx me ya BuyCourseButton.jsx me
// useGetCourseDetailWithStatusQuery isko hum use krenge CourseDetail.jsx me