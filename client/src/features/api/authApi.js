// hum api isi ke ander bna lenge  02:20:00


// rtk query use krne ke liye hum kiye krenge ki 
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8080/api/v1/user/"

export const authApi = createApi({
     reducerPath:"authApi", // authApi ye naam aap khuch bhi rhak shakte ho , generally jo function ka naam hota hai vhai de dete hai
     baseQuery:fetchBaseQuery({
        //baseUrl me vo api hoga jo api ka end point hoga
        baseUrl: USER_API,
        credentials: 'include' // issko nhai diya to error aayega 
        // reducerPath, baseQuery, baseUrl, credentials ye name yehi hone chaye knyuki ye propertiese hai 
     }),
     endpoints: (builder)=>({
        // agr mere ko data fetch krna ho ya data post krna ho to hum isi builder ka use krenge 
        registerUser: builder.mutation({  // jab mere ko api se data fetch krna hota hai to hum query use krte hai, aur jab data send/post krna hota hai to hum mutation use krte hai 
           query: (inputData) => ({ // jo data aayega usko yha recieve krenge 
              url:"register", // yaani ye user konse end point pe hit krega yaani register pr hit krega "http://localhost:8080/api/v1/user/register" ye aisa banjayega abhi
              method:"POST",
              body:inputData
           })
        }),

        // ab login ke liye bhi bna lete hai  ek mutation 
        loginUser: builder.mutation({   // ye post krne wala data hoga to mutation rhaega
            query: (inputData) => ({ 
               url:"login", //"http://localhost:8080/api/v1/user/login"
               method:"POST",
               body:inputData
            }),

            // to jese hi login krega to hum ek action ko dispatch krenge , bassically ek function bnayenge 
            async onQueryStarted(arg, {queryFulfilled, dispatch}){ // jab bhi  loginUser function call hoga to ye onQueryStarted wala function execute 
               try {
                  const result = await queryFulfilled;
                  dispatch(userLoggedIn({user:result.data.user}));// ye user vo hai jo hum login krte hai tab return kr rhe hai backend me 
               } catch (error) {
                  console.log(error);
                  
               }
            }
         }),

         //mutation for log out 
         logoutUser: builder.mutation({
            query: () => ({
               url:"logout",
               method:"GET"
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}){
               try {
                  dispatch(userLoggedOut());// ab isme hum user ko null set krdenge kynuki logout ho gya 
               } catch (error) {
                  console.log(error);
                  
               }
            }
         }),

         // ab hum yha ek aur query bnayenge profile get krne ke liye, get ke liye hum query use krte hai 
         loadUser: builder.query({
            query: ()=>({
               url:"profile",
               method:"GET",
               // isme body me khuch dena nhai knyuki hum sirf fetch kr rhe hai 

            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}){ // 5:45:00
               try {
                  const result = await queryFulfilled;
                  dispatch(userLoggedIn({user:result.data.user}));// ye user vo hai jo hum login krte hai tab return kr rhe hai backend me 
               } catch (error) {
                  console.log(error);
                  
               }
            }
         }),

  

         //ab update profile ke liye bhi ek mutation  bna lenege 
         updateUser: builder.mutation({
            query: (FormData)=>({
               url:"profile/update",  // ye backen me se route.js me aarhe hai 
               method:"PUT",
               body:FormData,
               credentials:"include" //  ye optional hai knyki humne uper ek aur used kiya hai
            })
         })


     })
})


export const {useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation, useLoadUserQuery, useUpdateUserMutation} = authApi; // ab is authApi ko mere ko rootReducer.js me bhi use krna pdega 
 // ye apne hook hote hai ek tarike ka , ab inko hum yha se khai pr bhi use kr shakte hai , Login.jsx me use kr rhe hai abhi  aur store.js me bhi 
// useRegisterUserMutation, useLoginUserMutation, useLoadUserQuery ye query apne aap bnegi , aur inko hum frontend me use kr lenge 