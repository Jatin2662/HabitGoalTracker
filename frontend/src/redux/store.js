
import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './slice/toastSlice';
import themeReducer from './slice/themeSlice';
import navReducer from './slice/navSlice';


const store = configureStore({
    reducer:{
        toast: toastReducer,
        theme: themeReducer,
        nav: navReducer
    }
});


export default store;