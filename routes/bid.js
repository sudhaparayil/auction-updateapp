const express = require("express");
const router = express.Router();
// const mongoose = require('mongoose');

const config = require('../config/database');

const User = require("../model/user");
const Product = require("../model/product");
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "mean.symptots@gmail.com", // generated ethereal user
        pass: "Symptots@2017"  // generated ethereal password
    }
});

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
       // return res.json(users);
       
    })
    
});

//all products
router.get('/products',(req,res,next)=>{
    Product.getAllProduct((err,product)=>{
        if(err) throw err;
        return res.json(product);
    })    
});
//



//fetch closed products


    router.get('/closed_products',(req,res,next)=>{
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
           // return res.json(users);
          // cosole.log(users);
       



            Product.getAllClosedProduct((err,close)=>{
                // if(err) throw err;
        
                 //return res.json(products);
                 close.forEach(function(arr) {
                    var highest = arr.bid_amount;
                    var winnerEmail = '';
                    arr.bidders.forEach(function(elm) {
                            if (elm.amount >= highest){
                                winnerEmail = users[elm.user_id].email;
                            } 
                    });
     //*****************email for winner****************************
                    nodemailer.createTestAccount((err, account) => {
                        
                            // create reusable transporter object using the default SMTP transport
                           
                        
                            // setup email data with unicode symbols
                            let mailOptions = {
                                from: 'mean.symptots@gmail.com', // sender address
                                to: winnerEmail,// list of receivers
                                subject: 'Auction Winner', // Subject line
                                text: '', // plain text body
                                html: '<b><h3>Hi,</h3><br/>Congratulation ....you won<br/> Thank You!</b>' // html body
                            };
                        
                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, (error, info) => {
                                // console.log('mail');
                                if (error) {
                                    console.log('error');
                                     return console.log(error);
                                }
                                // console.log('Message sent: %s', info.messageId);
                                
                                // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        
                                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                            });
                        });

//***************** END email for winner****************************
                    arr.bidders.forEach(function(elm) {
                            if (winnerEmail != users[elm.user_id].email){
                              //********************email for particpants******************
                              nodemailer.createTestAccount((err, account) => {
                                
                                    // create reusable transporter object using the default SMTP transport
                                   
                                
                                    // setup email data with unicode symbols
                                    let mailOptions = {
                                        from: 'mean.symptots@gmail.com', // sender address
                                        to: users[elm.user_id].email,// list of receivers
                                        subject: ' Auction ', // Subject line
                                        text: '', // plain text body
                                        html: '<b><h3>Hi,</h3><br/>thank you for your particpation <br/> Thank You!</b>' // html body
                                    };
                                
                                    // send mail with defined transport object
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        // console.log('mail');
                                        if (error) {
                                            console.log('error');
                                             return console.log(error);
                                        }
                                        // console.log('Message sent: %s', info.messageId);
                                        
                                        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                
                                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                                    });
                                });
         //********************END email for particpants******************
                            } 
                    });





                   // console.log(arr.bidders.length);
            });
            
         });
        })
        });
        

//intrested users
router.get('/intrested',function(req,res){
    
         
                // console.log("user get");
                Product.getIntrestedProduct((err,products)=>{
                    if(err) throw err;
                    products.forEach(function(i) {
                        // console.log(i.intrested_ids);
                        i.intrested_ids.forEach(function(elem) {
                          
    
                            User.getUsers((err,user)=>{
                                // console.log(user);
                                if(err) throw err;
                                var users = {};
                                user.forEach((usr, i) => {
                                    tmp = {};
                                    tmp._id = usr._id;
                                    tmp.name = usr.name;
                                    tmp.email = usr.email;
                                    tmp.date_tym = usr.date_tym;
                                    users[usr._id] = tmp;
                                    // console.log(users);
                                    if(err){
                                        console.log("Error " + err);
                                    }else{
                                 
                                 nodemailer.createTestAccount((err, account) => {
                                            
                                                // create reusable transporter object using the default SMTP transport
                                               
                                            
                                                // setup email data with unicode symbols
                                                let mailOptions = {
                                                    from: 'mean.symptots@gmail.com', // sender address
                                                    to: users[elem.user_id].email,// list of receivers
                                                    subject: 'Bid started', // Subject line
                                                    text: '', // plain text body
                                                    html: '<b><h3>Hi,</h3><br/>We are started a new bid <br/> Thank You!</b>' // html body
                                                };
                                            
                                                // send mail with defined transport object
                                                transporter.sendMail(mailOptions, (error, info) => {
                                                    // console.log('mail');
                                                    if (error) {
                                                        console.log('error');
                                                         return console.log(error);
                                                    }
                                                    // console.log('Message sent: %s', info.messageId);
                                                    
                                                    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                            
                                                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                                                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                                                });
                                            });
                                            
                                           
                                    
                                    } 
                                      
    
                                });
                             //   return res.json(users);
                               // console.log(users)
                               
                            })
    
                    });
                });
                  
                    // this.user.email.forEach((i) => {
                    //     console.log(i);
                    //   });
                
                    console.log(products[0].starting_informed);
                    console.log(products[0]._id);
                    Product.findByIdAndUpdate(products[0]._id,
                        {
                            $set : {"starting_informed" : "true"  }
                        },
                        {
                        new :true
                        },
                        function(err, updatedPro){
                            if(err){
                                res.send("error on send mail ");
                            }else{
                                res.json(updatedPro);
                            }
                        }
                    
                       )
                    // return res.json(products);
             
                    
                });
            });
            

    
module.exports = router;