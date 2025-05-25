

import { createSlice } from '@reduxjs/toolkit';


const toastSlice = createSlice({
    name: 'toast',
    initialState:{
        visible: false,
        message: '',
        type: 'success'
    },
    reducers:{
        showToast: (state, action)=>{
            const { message, type = 'success' } = action.payload;
            state.visible = true;
            state.message = message;
            state.type = type;
        },
        hideToast: (state)=>{
            state.visible = false;
            state.message = '';
        }
    }
})

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;