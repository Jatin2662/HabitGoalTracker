
import { configureStore } from "@reduxjs/toolkit";
import toastReducer from './slice/toastSlice';
import themeReducer from './slice/themeSlice';
import navReducer from './slice/navSlice';
import loaderReducer from './slice/loaderSlice';


const store = configureStore({
    reducer:{
        toast: toastReducer,
        theme: themeReducer,
        nav: navReducer,
        loader: loaderReducer
    }
});


export default store;