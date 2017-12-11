const express = require("express");
const router = express.Router();
// const mongoose = require('mongoose');

const config = require('../config/database');
const User = require("../model/user");

router.get('/users_id_as_index',(req,res,next)=>{
    User.getUsers((err,user)=>{
        if(err) throw err;
        var users = {};
        user.forEach((usr, i) => {
            tmp = {};
            tmp._id = usr._id;
            tmp.name = usr.name;
            tmp.email = usr.email;
            tmp.date_tym = usr.date_tym;
            users[usr._id] = tmp;
        });
        return res.json(users);
       
    })
    
});

module.exports = router;