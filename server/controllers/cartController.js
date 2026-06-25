const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({user: req.user.id,});
        if (!cart) {
            cart = await Cart.create({user: req.user.id,items: [],});
        }
        const itemIndex = cart.items.findIndex((item) =>item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({product: productId,quantity,});
        }
        await cart.save();
        const io = req.app.get("io");
        io.emit("activity", {
            type: "CART",
            message: `Product added to cart`,
            time: new Date(),
        });
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({message: error.message,});

    }
};
const getCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user.id,
        }).populate('items.product');

        res.json(cart);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};
const removeFromCart = async (req, res) => {
    try {

        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.user.id,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            (item) =>
                item.product.toString() !== productId
        );

        await cart.save();
        const io = req.app.get("io");
        io.emit("activity", {
            type: "CART_REMOVE",
            message: "Product removed from cart",
            time: new Date(),
        });
        res.json(cart);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};
const updateCartQuantity = async (req, res) => {
    try {

        const { productId, quantity } =
            req.body;

        const cart = await Cart.findOne({
            user: req.user.id,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            (item) =>
                item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

        item.quantity = quantity;

        await cart.save();
        const io = req.app.get("io");
        io.emit("activity", {
            type: "CART_UPDATED",
            message: "Cart quantity updated",
            time: new Date(),
        });
        res.json(cart);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};
module.exports = {addToCart,getCart,removeFromCart,updateCartQuantity,};