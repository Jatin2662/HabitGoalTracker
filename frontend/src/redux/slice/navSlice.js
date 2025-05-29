

import { createSlice } from "@reduxjs/toolkit";

const navSlice = createSlice({
    name: 'nav',
    initialState:{
        visible: false,
        value: 'Dashboard'
    },
    reducers: {
        showNav:(state)=>{
            state.visible = true;
        },
        hideNav: (state, action)=>{
            state.visible = false;
            state.value = action.payload;
        }
    }
});

export const { showNav, hideNav } = navSlice.actions;
export default navSlice.reducer;