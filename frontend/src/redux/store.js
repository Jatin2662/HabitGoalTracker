
import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './slice/toastSlice';
import themeReducer from './slice/themeSlice';


const store = configureStore({
    reducer:{
        toast: toastReducer,
        theme: themeReducer
    }
});


export default store;