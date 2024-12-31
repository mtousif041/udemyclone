import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";

export const appStore = configureStore({ // ab is store ko hum main.jsx me use krlenge 
  reducer:rootReducer,
  middleware:(defaultMiddleware)=>defaultMiddleware().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware)
});



//hum jab bhi refresh krte hai to user logout ho jata hai yaani uska data persist nhai rheta hai , to hum kiya krenege ki ki jub bhi refresh ho to to wapas se ye data load ho jaaye  aur iska dusra solution yhe hai ki isko persist krlo but hya pr persist nhai krne waaale hai 
const initializedApp = async ()=>{
  await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, {forceRefetch:true}))
}// isse kiya hoga ki jab koi refresh krta hai ya refresh hota hai to is wale endpoints pe yhe hit hoga authApi.endpoints.loadUser aur ye ho jaayega dispatch aur jab bhi dispatch call hoga to every time loadUser call ho jaayega , authApi.endpoints.loadUser ye hmare authApi.js me hai 
initializedApp()
//aur isko yahi pr call kr dunga 
