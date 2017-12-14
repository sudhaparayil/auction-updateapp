const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const config = require("../config/database");

const UserSchema = mongoose.Schema({
    name : {type : String, require : true, unique : true},
    email : String,
    phone : String,
    password : String,
    block_status : { type: String, default: false },
    delete_status :{ type: String, default: false },
    verified : { type: String, default: false },
    verification_code :String,
    fb_id : String,
    google_id : String,
    date_tym : { type: Date, default: Date.now },
    role : { type: String, default: 'user' },
});

const User = module.exports = mongoose.model('User', UserSchema,'users');




//all users
module.exports.getUsers = function(callback){
    User.find({role:'user',verified:'true'},callback);
   // User.find({role:'user',verified:'true',delete_status:'false',block_status:'false'},callback);
   
}