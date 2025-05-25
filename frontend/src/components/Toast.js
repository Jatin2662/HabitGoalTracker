

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../redux/slice/toastSlice';
import '../styles/Toast.css';

function Toast() {

    const dispatch = useDispatch();
    const { visible, message, type } = useSelector(state => state.toast)

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                dispatch(hideToast());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, dispatch]);

    if (!visible) return null;

    return (
        <div className={`custom-toast ${type}`}>
            {message}
        </div>
    );
}

export default Toast;
