const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: [
            'Pending',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled',
        ],
        default: 'Pending',
    },
    paymentStatus:{
        type:String,
        enum:[
            'Pending',
            'Paid',
            'Failed',
            'Refunded',
        ],
        default:'Pending',
    },
    paymentMethod: {
        type: String,
        enum: [
            "Credit Card",
            "Debit Card",
            "UPI",
            "Net Banking",
            "Cash On Delivery",
        ],
        default: "Card",
    },
    bank:{
        type:String,
        default:"",
    },
    transactionId: {
        type: String,
        default: "",
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Order',orderSchema);