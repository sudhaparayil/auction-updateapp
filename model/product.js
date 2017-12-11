const mongoose = require("mongoose");
const config = require("../config/database");
var Schema = mongoose.Schema;
const ProductsSchema = mongoose.Schema({
        name: {
            type : String,
            required : true,
        },
        image: {
            type : String,
        },
        desc: {
            type : String,
        },
        bid_amount: {
            type : Number,
            require : true,
        },
        min_bid_rate: {
            type : Number,
            deafult: 0
        },
        start_date : {
            type : Date,
            require:true
        },
        end_date : {
            type : Date,
            require:true
        },
        date_time : {
            type : Date,
            default: Date.now
        },
        status:{
            type:Boolean,
            deafult:true

        },
        intrested_ids: [{
            user_id: String ,
            date_time : { 
                type : Date, 
                default: Date.now
            } 
        }],
        bidders: [{
            user_id: String ,
            amount: Number,
            date_time : { 
                type : Date, 
                default: Date.now
            }, 
            bid_status : { 
                type : String, 
                default: "participated"
            } 
        }],
        is_bid_completed : {
            type: Boolean,
            default: false
        },
        starting_informed :{
            type: Boolean,
            default: false
        },
        closing_informed :{
            type: Boolean,
            default: false
        },
        user_notification : {
            user_id : Schema.ObjectId ,
            status : {
                type : Boolean,
                default : true,
            }
        }
       
});

const Product = module.exports = mongoose.model('Product', ProductsSchema,'products');



module.exports.addProduct = function(product,callback){
    console.log(product);
    var newProduct = new Product(product);
    newProduct.save(callback);
}

module.exports.getAllProduct = function(callback){
    Product.find({},callback);
}


module.exports.getAllClosedProduct = function(callback){
    Product.find({"end_date" : {"$lte" : new Date()},"status":true,"closing_informed":false},callback);
}


module.exports.getIntrestedProduct = function(callback){
    Product.find({"start_date" : {"$lte" : new Date()},"status":true,"starting_informed":false},callback);
    
}
module.exports.deleteProduct = function(id,callback){
    const query = {_id: id}
    Product.remove(query,callback);
}

module.exports.getProductById = function(id,callback){
    Product.findOne({_id: id},callback);
}
// module.exports.getAllClosedProductdetails = function(callback){
//     db.products.aggregate([
//         {
//            $unwind: "$bidders"
//         },
//         {
//            $lookup:
//               {
//                  from: "users",
//                  localField: "bidders",
//                  foreignField: "user_id",
//                  as: "product_docs"
//              }
//         },
//         {
//            $match: { "product_docs": { $ne: [] } }
//         }
//      ])
// }