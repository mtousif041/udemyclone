import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


const COURSE_API = "http://localhost:8080/api/v1/course"

export const courseApi = createApi({ // isko rootReducer.js me bhi provide krna pdega 
    reducerPath:"courseApi",
    tagTypes:['Refetch_Creator_Course', "Refetch_Lecture"], // yaani jab bhi hum course create krnge to table me vo apne aap refetch hokar show ho jaaye , aur kab kab refetch krna hai iske liye hum invalidatesTags ka use krenge niche dheko , Refetch_Creator_Course ki jagha aap khuch bhi likh shakte ho 
    baseQuery:fetchBaseQuery({
        baseUrl:COURSE_API,
        credentials:"include"
    }),

    //ab iske baad mere ko end point create krne hote hai 
    endpoints:(builder)=>({ // ye ek call back function hai jo return kr hra hai mutation ya query ko 
         createCourse:builder.mutation({
            query: ({courseTitle, category})=>({
                url:"", // kyunki humne course.route.js me createCourse ke liye "/" lga rhka hai 
                method:"POST",
                body:{courseTitle, category},
            }),
            invalidatesTags:['Refetch_Creator_Course'] //jab jab hum naya course create to refetch krenge 
                
         }),

         /////// for searching by query , searchCourse , is me hum query se khuch search krne wale hai isliye ye thoda alag hoga 
         getSearchCourse: builder.query({
            query:({searchQuery, categories, sortByPrice})=>{
                //Build query string 
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}` //encodeURIComponent yaani ki agr searchQuery me khuch ghadbad bhi hogi to tab bhi chal jaayegi 

                // append category
                if(categories && categories.length > 0){
                    const categoriesString = categories.map(encodeURIComponent).join(",");
                    queryString += `&categories=${categoriesString}`;
                }

                //append sortByPrice if available in queryString
                if(sortByPrice){
                 queryString += `&sortByPrice=${encodeURIComponent(categoriesString)}`;
                }

                //ab apne pass queryString ready hai usko url me pass krenege 

                return {
                    url:queryString,
                    method:"GET",
                }
               
            }
         }),



           
        // yha pr /published-courses ko fetch krne ke liye bhi bna lenge 
        getPublishedCourse: builder.query({
            query:()=>({
                url:`/published-courses`, 
                method:"GET",
            }),
        }),
                
           
         /////for getting all courses which created by  specific user
         getCreatorCourse:builder.query({
            query: ()=>({
                url:"", // kyunki humne course.route.js me createCourse ke liye "/" lga rhka hai 
                method:"GET"
            }),
            providesTags:['Refetch_Creator_Course']
        }),

        // ab edit course ke liye bhi bna kenge 
        editCourse: builder.mutation({
            query: ({formData, courseId})=>({
                url:`/${courseId}`,
                method:"PUT",
                body:formData
            }),
            invalidatesTags:['Refetch_Creator_Course']
            
        }),
                
        // ab edit course phele se fill aaye agr dobara edit course me jaae to, uske ke liye bhi bna lenge 
        getCourseById: builder.query({
            query: (courseId)=>({
                url:`/${courseId}`,
                method:"GET",
            })
        }),

        // yha pr create lecture ke liye bhi mutation bna lenge 
        createLecture: builder.mutation({
            query: ({lectureTitle, courseId})=>({
                url:`/${courseId}/lecture`,
                method:"POST",
                body:{lectureTitle}
            }),
        }),

         // yha pr get lecture ke liye bhi query bna lenge 
         getCourseLecture: builder.query({
            query: (courseId)=>({
                url:`/${courseId}/lecture`,
                method:"GET",
            }),
            providesTags:["Refetch_Lecture"]
        }),

        ///yha pr editLecture ke liye bhi bna lenge 
        editLecture: builder.mutation({
            query:({lectureTitle, videoInfo, isPreviewFree, courseId, lectureId })=>({
                url:`/${courseId}/lecture/${lectureId}`,
                method:"POST",
                body:{lectureTitle, videoInfo, isPreviewFree}
            })
        }),
                

        ///yha pr removeLecture ke liye bhi bna lenge 
        removeLecture: builder.mutation({
            query:(lectureId)=>({
                url:`/lecture/${lectureId}`, // yhe wale route route.js ke same hi honge 
                method:"DELETE",
            }),
            invalidatesTags:["Refetch_Lecture"]
        }),
                
            

        ///ab hum yha pr jab hum lecture ke edit button pr click krte hai to usme saari value field mile wapas se dene ki jaroorat na ho , uske liye bhi bna lenge 
        getLectureById: builder.query({
            query:(lectureId)=>({
                url:`/lecture/${lectureId}`, // yhe wale route route.js ke same hi honge 
                method:"GET",
            }),
        }),
                
        // yha pr published aaur unpublished ke liye bhi bna lenge 
        publishCourse: builder.mutation({
            query:({courseId, query})=>({
                url:`/${courseId}?publish=${query}`, 
                method:"PATCH",
            }),
        }),
                
            
      
            
        
                

    })
})


export const {useCreateCourseMutation, useGetSearchCourseQuery, useGetPublishedCourseQuery, useGetCreatorCourseQuery, useEditCourseMutation, useGetCourseByIdQuery, useCreateLectureMutation, useGetCourseLectureQuery, useEditLectureMutation, useRemoveLectureMutation, useGetLectureByIdQuery, usePublishCourseMutation } = courseApi;// ab is courseApi ko mere ko rootReducer.js me bhi use krna pdega 

// useCreateCourseMutation ye rtk query apne aap coustom hook bna leta hai 
// useGetPublishedCourseQuery isko hum use krenge Courses.jsx me  
// useGetSearchCourseQuery isko hum use krenge SearchPage.jsx me  
// useCreateCourseMutation isko hum use krnege AddCourse.jsx me
//useGetCreatorCourseQuery isko hum use krnege CourseTable.jsx me
// useEditCourseMutation isko hum use krenge EditCourse.jsx me 
// useGetCourseByIdQuery isko hum use krenge CourseTab.jsx me 
// useCreateLectureMutation isko hum use krenge CreateLecture.jsx me 
// useGetCourseLectureQuery isko hum use krenge CreateLecture.jsx me 
// useEditLectureMutation isko hum use krenge LectureTab.jsx me  
// useRemoveLectureMutation isko hum use krenge LectureTab.jsx me  
// useGetLectureByIdQuery isko hum use krenge LectureTab.jsx me  
// usePublishCourseMutation isko hum use krenge CourseTab.jsx me  
