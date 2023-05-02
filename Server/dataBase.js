const mongoose=require('mongoose');
const express = require('express');
const app = express();
const User=require('./Schemas/User');
const Hall=require('./Schemas/Halls');
const Roles =require('./Schemas/Roles');

const userRoutes = require('./Routes/userRoute');
const hallRoutes = require('./Routes/hallRoute');


class Database{
    constructor(){
this.url="mongodb://127.0.0.1:27017/halBooking"
    }
    connect(){
        mongoose.connect(this.url)
        .then(()=>{
            console.log(' Database connection succeeds')
        })
        .catch((er)=>{
            console.log(`error in connection ${er}`)
        })
      
       

    }


}

module.exports=Database;