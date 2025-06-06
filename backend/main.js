

const express = require('express');
const app = express();

require('dotenv').config()
require('./utils/db.js')
const cors = require('cors')

const AuthRoutes = require('./routes/AuthRoutes.js');
const UserRoutes = require('./routes/UserRoutes.js');
const AdminRoutes = require('./routes/AdminRoutes.js');


const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use('/auth', AuthRoutes);
app.use('/user', UserRoutes);
app.use('/admin', AdminRoutes);


app.listen(PORT, ()=>{
    console.log(`Working on Port ${PORT}`);
})