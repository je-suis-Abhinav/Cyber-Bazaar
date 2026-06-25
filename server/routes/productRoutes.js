const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const express=require('express');
const {createProduct, getProducts, getProductById, updateProduct, deleteProduct}=require('../controllers/productController');
const router=express.Router();
router.route('/') .get(getProducts) .post(protect,adminOnly,createProduct);
router.route('/:id') .get(getProductById) .put(protect,adminOnly,updateProduct) .delete(protect,adminOnly,deleteProduct);
module.exports=router;
