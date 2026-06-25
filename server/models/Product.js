const mongoose=require('mongoose')
const productSchema=new mongoose.Schema(
    {
        name:{ type:String, required:true},
        description:{type:String,required:true},
        category:{type:String, required:true},
        price:{type:Number,required:true},
        stock:{type:Number,required:true,default:0},
        rating:{type:Number,default:4.5},
        image:{type:String},
        tags:[String]
    },
    {
        timestamps:true
    }
);
module.exports = mongoose.model('Product', productSchema);