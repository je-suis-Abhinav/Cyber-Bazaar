const Product=require('../models/Product');
const createProduct=async(req,res)=>{
    try
    {
        const product=await Product.create(req.body);
        const io=req.app.get("io");
        res.status(201).json(product);
        io.emit("activity", {
        type: "PRODUCT_CREATED",
        message: `${product.name} added`,
        time: new Date(),
        });
    }
    catch(error)
    {
        res.status(500).json({message: error.message});
    }
};
const getProducts = async (req, res) => {
    try 
    {
        const products = await Product.find();
        res.json(products);
    } 
    catch (error) 
    {
        res.status(500).json({message: error.message});
    }
};
const getProductById = async (req, res) => {
    try 
    {
        const product = await Product.findById(req.params.id);
        if (!product) 
        {
        return res.status(404).json({message: 'Product not found'});
        }
        res.json(product);
    } 
    catch (error) 
    {
        res.status(500).json({message: error.message});
    }
};
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );

        if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
        }
        const io = req.app.get("io");
        io.emit("activity", {
            type: "PRODUCT_UPDATED",
            message: `${product.name} updated`,
            time: new Date(),
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({
        message: error.message,
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        const io = req.app.get("io");
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        io.emit("activity", {
        type: "PRODUCT_DELETED",
        message: `${product.name} removed`,
        time: new Date(),
        });
        res.json({
            message: "Product deleted",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
module.exports={createProduct,getProducts,getProductById,updateProduct,deleteProduct};