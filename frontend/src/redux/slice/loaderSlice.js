

import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
    name: 'loader',
    initialState:{
        hidden: false,
        text: ''
    },
    reducers:{
        showLoader: (state, action) => {
            state.hidden = true;
            state.text = action.payload;
        },
        hideLoader: (state) =>{
            state.hidden = false;
        }
    }
})

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;