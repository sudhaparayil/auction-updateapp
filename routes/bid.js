const express = require("express");
const router = express.Router();
// const mongoose = require('mongoose');
//var CronJob = require('cron').CronJob;
var schedule = require('node-schedule');
const config = require('../config/database');
var http = require('http');
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

//get active users
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

//all products
router.get('/products',(req,res,next)=>{
    Product.getAllProduct((err,product)=>{
        if(err) throw err;
        return res.json(product);
    })    
});




//fetch closed products


   // router.get('/closed_products',(req,res,next)=>{
        var j = schedule.scheduleJob('*/1 * * * *', function(){
            console.log('update every  1 min');
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
                //console.log(close);
           
                 //return res.json(products);
               
                 close.forEach(function(arr) {

                    var extServerOptions = {
                        host: 'localhost',
                        port: '3000',
                        path: '/products/inform-closedproduct/' + arr._id,
                        method: 'GET'
                    };
                    function get() {
                        http.request(extServerOptions, function (res) {
                            res.setEncoding('utf8');
                         
                     
                        }).end();
                    };
                     
                    get();
                 console.log(arr.name);
                    var highest = arr.bid_amount;
                    var winnerEmail = '';
                    var winnerid = '';
                    arr.bidders.forEach(function(elm) {
                            if (elm.amount >= highest){
                              //  console.log('highest :' + highest);
                                highest = elm.amount;
                                //console.log('elm amount :' + elm.amount);
                                winnerEmail = users[elm.user_id].email;
                                winnerid = users[elm.user_id]._id;
                            } 
                    });
     //*****************email for winner****************************
                  
console.log(winnerEmail);
nodemailer.createTestAccount((err, account) => {
    
        // create reusable transporter object using the default SMTP transport
       
    // console.log(users[elem.user_id].email);
        // setup email data with unicode symbols
        
        let mailOptions = {
           
            from: 'mean.symptots@gmail.com', // sender address
            to: winnerEmail,// list of receivers
            subject: 'Congratulations! You have won an auction', // Subject line
            text: '', // plain text body
            html: '<b><h3>Congratulations,</h3><br/>Yours was the winning bid on Auction on item. You got a great deal! I am looking forward to a pleasant transaction and positive feedback for both of us. <br/>You can confirm or reject your item on link: </a> http://192.168.1.9:3000/email-verification/'+arr._id+'</a><br/>I am delighted to be dealing with you and know you will enjoy your purchase. I’d also like to invite you to check out my other items available on Auction.<br/> Thank You!</b>'  // html body
        };
        console.log();
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
                         console.log(users[elm.user_id].email);
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
//update closing inform status $ push user notification
var value = {
    user_id: winnerid,
    status: true
};
               // console.log(arr._id);
                    Product.findByIdAndUpdate(arr._id,
                        {
                            $set : {"closing_informed" : "true", "user_notification" :value }
                        },
                        {
                        new :true
                        },
                        function(err, updatedclose){
                            if(err){
                               // res.send("error on send mail ");
                            }else{
                                var extServerOptions = {
                                    host: 'localhost',
                                    port: '3000',
                                    path: '/products/inform-notifi-user/' +winnerid,
                                    method: 'GET'
                                };
                                function get() {
                                    http.request(extServerOptions, function (res) {
                                        res.setEncoding('utf8');
                                     
                                 
                                    }).end();
                                };
                                 
                                get();
                                // res.json(updatedclose);
                            }
                        }
                    
                       )


     

                  console.log(arr._id);
            });
           
      
         });
        })
   
      
//intrested users
 //router.get('/intrested',function(req,res){
        User.getUsers((err,user)=>{
            // console.log(user);
            if(err) throw err;
            var users = {};
            user.forEach((usr, c) => {
                tmp = {};
                tmp._id = usr._id;
                tmp.name = usr.name;
                tmp.email = usr.email;
                tmp.date_tym = usr.date_tym;
                users[usr._id] = tmp;
                // console.log(users);
     
            // console.log("user get");
            Product.getIntrestedProduct((err,products)=>{
           
                if(err) throw err;
                products.forEach(function(i) {
                    var extServerOptions = {
                        host: 'localhost',
                        port: '3000',
                        path: '/products/inform-startproduct/' + i._id,
                        method: 'GET'
                    };
                    function get() {
                        http.request(extServerOptions, function (res) {
                            res.setEncoding('utf8');
                         
                     
                        }).end();
                    };
                     
                    get();
                   
                    // console.log(i.intrested_ids);
                    i.intrested_ids.forEach(function(elem) {
                      
// console.log(elem.user_id)
                       
                               
                             nodemailer.createTestAccount((err, account) => {
                                        
                                            // create reusable transporter object using the default SMTP transport
                                           
                                        // console.log(users[elem.user_id].email);
                                            // setup email data with unicode symbols
                                            
                                            let mailOptions = {
                                               
                                                from: 'mean.symptots@gmail.com', // sender address
                                                to: users[elem.user_id].email,// list of receivers
                                                subject: 'Bid started', // Subject line
                                                text: '', // plain text body
                                                html: '<b><h3>Hi ' +users[usr._id].name+ ',</h3><br/>We are very gratefull to know your intrest to the product  "' +products[0].name+ '"  the bidding is open now, Hope you can give the best bid..<br/> Thank You!</b>' // html body
                                            };
                                            // console.log();
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
                                        
                                       
                                
                                
                                  

                            });
                            Product.findByIdAndUpdate(products[0]._id,
                                {
                                    $set : {"starting_informed" : "true"  }
                                },
                                {
                                new :true
                                },
                                function(err, updatedPro){
                                    if(err){
                                      //  res.send("error on send mail ");
                                    }else{
                                        // res.json(updatedPro);
                                    }
                                }
                            
                               )
                         
                           
                        })

                });
               
           
             
                
            });
         
           
        });
        });
        
   
    
module.exports = router;