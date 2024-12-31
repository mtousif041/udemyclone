import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";

const rootReducer = combineReducers({ // me yha pr combineReducers reducers use kr rha hu knyuki apne ko yha pr multiple api add krni hai 
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer, // ab isko bhi middleware me pass krna pdega store.js me
    [purchaseApi.reducerPath]: purchaseApi.reducer, // isko bhi store.js me pass kr dhenge 
    [courseProgressApi.reducerPath]: courseProgressApi.reducer, // isko bhi store.js me pass kr dhenge 
    auth: authReducer
});

export default rootReducer;