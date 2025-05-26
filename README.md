

# Habit Goal Tracker MERN App

## Overview

- This app helps to add, delete, update habits and track them on daily basis, yet all functionalities are not yet implemented. Work is in Progress!!!

## How to run

- run `npm install` in root, frontend, backend
- run `npm run dev` in root to start application.
- If error you can look for root `package.json` and find "dev": "concurrently \"cd frontend && npm start\" \"cd backend && nodemon main.js\" "

## Features

- Add, Update, Delete, Visualize Habits
- Update user details, theme preference.

## Technology Used

1. BACKEND 
- JWT
- JOI
- CORS
- Role Based Access
- Full CRUD Operations for habits


2. Frontend
- React Calendar
- Responsive Design (Partially responsive, working on it)

## Notes

- Ensure node_modules are installed individually in:
    - Root (/)
    - Frontend (/frontend)
    - Backend (/backend)

## Future Scope

1. Email verification using `Nodemailer`
2. User Tracking more Dynamic (Currently work in progress)
3. Use of **Cookies**, **Session Storage** - for persistent and secure sessions
4. Caching, Filtering - to improve **Performance**