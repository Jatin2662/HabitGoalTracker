

import { createSlice } from "@reduxjs/toolkit";

const navSlice = createSlice({
    name: 'nav',
    initialState:{
        visible: false,
        type: '',
        value: 'Dashboard'
    },
    reducers: {
        showNav:(state)=>{
            state.visible = true;
            state.type = 'show';
        },
        hideNav: (state, action)=>{
            state.visible = false;
            state.type = '';
            state.value = action.payload;
        }
    }
});

export const { showNav, hideNav } = navSlice.actions;
export default navSlice.reducer;