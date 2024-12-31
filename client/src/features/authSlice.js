// const { createSlice } = require("@reduxjs/toolkit"); //ab agr  ye aise import kiya to error aayega 
import {createSlice} from "@reduxjs/toolkit";

const initialState ={
    user:null,
    isAuthenticated:false
}

const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:{ // reducers ke ander multiple action hote hai , jese userLoggedIn ek action hai 
     userLoggedIn:(state, action) => { //action 1 hai ye 
        //action.payload.user ye kha se aarha hai hum jab userLoggedIn acction ko distpatch krenge yaani userLoggedIn ko jab call krenge , ye bhi ek trha ka function hi hai
        state.user = action.payload.user;
        state.isAuthenticated = true;
     },

     userLoggedOut:(state)=>{ // action 2 , isme action use nhai ho rha hai to tum hta bhi shakte ho
        state.user = null;
        state.isAuthenticated = false;
     }


    },
});


export const {userLoggedIn, userLoggedOut} = authSlice.actions;
export default authSlice.reducer;  // ab is authSlice ko hum apne store me provide kr lenge 