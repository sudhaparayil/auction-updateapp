const express = require("express");
const router = express.Router();
// const mongoose = require('mongoose');

const config = require('../config/database');
const User = require("../model/user");
const Product = require("../model/product");

//all products
router.get('/products',(req,res,next)=>{
    Product.getAllProduct((err,product)=>{
        if(err) throw err;
        return res.json(product);
    })    
});
//closed products


    router.get('/closed_products',(req,res,next)=>{
            Product.getAllClosedProduct((err,products)=>{
                 if(err) throw err;
        
           
                 return res.json(products);
            })
            
         });
    
module.exports = router;