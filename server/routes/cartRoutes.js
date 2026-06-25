const express = require('express');
const {addToCart,getCart,removeFromCart,updateCartQuantity,} = require('../controllers/cartController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/', protect, addToCart);
router.get('/', protect, getCart);
router.delete('/:productId',protect,removeFromCart);
router.put('/',protect,updateCartQuantity);
module.exports = router;