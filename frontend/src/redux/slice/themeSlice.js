


import { createSlice } from '@reduxjs/toolkit';



const savedTheme = localStorage.getItem('theme') || 'light';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: savedTheme
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme =  action.payload
            localStorage.setItem('theme', action.payload);
        }
    }
})

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;