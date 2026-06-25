const Wishlist = require("../models/Wishlist");
const getWishlist = async (req,res)=>{
    try{

        let wishlist=await Wishlist.findOne({user:req.user.id,}).populate("products");
        if(!wishlist){
            wishlist=await Wishlist.create({
                user:req.user.id,
                products:[],
            });
        }
        res.json(wishlist);
    }catch(error){
        res.status(500).json({message:error.message,});
    }
};

const addToWishlist=async(req,res)=>{
    try{
        let wishlist=await Wishlist.findOne({user:req.user.id,});
        if(!wishlist){
            wishlist=await Wishlist.create({
                user:req.user.id,
                products:[],
            });
        }
        if(
            !wishlist.products.includes(req.params.productId)
        ){
            wishlist.products.push(req.params.productId);
            await wishlist.save();
        }
        res.json(wishlist);
    }catch(error){
        res.status(500).json({message:error.message,});
    }
};

const removeFromWishlist=async(req,res)=>{
    try{
        const wishlist=await Wishlist.findOne({user:req.user.id,});
        if(!wishlist)
            return res.json({products:[]});
        wishlist.products=wishlist.products.filter(id=>id.toString()!==req.params.productId);
        await wishlist.save();
        res.json(wishlist);
    }catch(error){
        res.status(500).json({message:error.message,});
    }
};

module.exports={getWishlist,addToWishlist,removeFromWishlist,};