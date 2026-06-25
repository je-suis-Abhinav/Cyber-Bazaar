const Order = require('../models/Order');
const Cart = require('../models/Cart');
const createOrder = async (req, res) => {
    try {

        const {
            paymentStatus,
            paymentMethod,
            bank,
            transactionId,
        } = req.body;

        const cart = await Cart.findOne({
            user: req.user.id,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
            });
        }

        const total = cart.items.reduce(
            (sum, item) =>
                sum + item.product.price * item.quantity,
            0
        );
        const gst = total * 0.18;
        const deliveryCharge =paymentMethod === "Cash On Delivery"? 50: 0;
        const grandTotal =total + gst + deliveryCharge;
        const order = await Order.create({
            user:req.user.id,
            items: cart.items.map(item => ({
                product:item.product._id,
                quantity:item.quantity
            })),
            total:grandTotal,
            paymentStatus,
            paymentMethod,
            bank:paymentMethod === "Net Banking"? bank: "",
            transactionId
        });
        const io = req.app.get("io");

        io.emit("activity", {
            type: "ORDER_CREATED",
            status:status,
            message: `New order placed worth ₹${total}`,
            time: new Date(),
        });

        cart.items = [];
        await cart.save();

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const getMyOrders = async (req,res) => {
    try {
        const orders =await Order.find({user: req.user.id,}).populate('items.product').sort({createdAt: -1,});
        res.json(orders);
    } catch (error) {
        res.status(500).json({message: error.message,});
    }
};

const getAllOrders = async (req,res) => {
    try {
        const orders =await Order.find().populate('user').populate('items.product').sort({createdAt: -1,});
        res.json(orders);
    } catch (error) {
        res.status(500).json({message: error.message,});
    }
};

const updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const update = { status };

        if (status === "Cancelled") {
            update.paymentStatus = "Refunded";
        }

       const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.status = status;
        if (status === "Cancelled") {
            if (order.paymentMethod === "Cash On Delivery") {
                order.paymentStatus = "Cancelled";
            } else {
                order.paymentStatus = "Refunded";
            }
        }
        if (
            status === "Delivered" &&
            order.paymentMethod === "Cash On Delivery"
        ) {
            order.paymentStatus = "Paid";
            order.transactionId = "COD-" + Date.now();
        }

        await order.save();
        const io = req.app.get("io");

        io.emit("activity", {
            type: "ORDER_STATUS",
            status:status,
            message: `Order updated to ${status}`,
            time: new Date(),
        });

        res.json(order);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {createOrder,getMyOrders,getAllOrders,updateOrderStatus,};