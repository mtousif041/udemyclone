import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "http://localhost:8080/api/v1/progress"
export const courseProgressApi = createApi({  // isko routeReducer.js me bhi add krna hai 

    reducerPath:"courseProgressApi", // ye name uper wala hi dena hai 
    baseQuery:fetchBaseQuery({ //iske ander hum initial informmation dete hai 
        baseUrl:COURSE_PROGRESS_API,
        credentials:"include"

    }),
    endpoints: (builder)=>({
        getCourseProgress:builder.query({ // yha query use krenge knyuki hum khuch bhej nhai rhae hai
           query: (courseId)=>({
            url:`/${courseId}`,
            method:"GET"
           })
        }),

        // ab update  lecture progress ko bhi bna lete hai 
        updateLectureProgress: builder.mutation({
            query: ({courseId, lectureId})=>({
             url:`/${courseId}/lecture/${lectureId}/view`,
             method:"POST",
        
            })
        }),

        /// ab mark as completed ke liye bhi bna lenge 
        completeCourse: builder.mutation({
            query: (courseId)=>({
             url:`/${courseId}/complete`,
             method:"POST",
        
            })
        }),

         /// ab mark as Incompleted ke liye bhi bna lenge 
         inCompleteCourse: builder.mutation({
            query: (courseId)=>({
             url:`/${courseId}/incomplete`,
             method:"POST",
             
            })
        }),



    }),
});

export const {useGetCourseProgressQuery, useUpdateLectureProgressMutation, useCompleteCourseMutation, useInCompleteCourseMutation} = courseProgressApi;

//useGetCourseProgressQuery used in CourseProgress.jsx