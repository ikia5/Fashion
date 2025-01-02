const port = 4000;

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const multer = require("multer");

const cors = require("cors");

const path = require("path");
const { errorMonitor } = require("events");
const { Console } = require("console");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//       Connect to MongoDB
mongoose.connect("mongodb+srv://duong3456789:1111@cluster0.x76l8mw.mongodb.net/fashion");

//       API
app.get("/", (req, res)=>{
    res.send("Express app is running")
})

//       Image storage
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage});

//       Create upload endpoint for images
app.use("/images", express.static(path.join(__dirname, "upload/images")))

app.post("/upload", upload.single("product"), (req, res)=>{
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })  
})

//       Schema for creating products
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    season:{
        type: String,
        required: true,
    },
    label:{
        type: String,
        required: true,
    },
    color:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
    },
})

//      Add more products
app.post("/addproduct", async (req, res) =>{
    let products = await Product.find({});
//      Generate id automatically
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
//       If there is no product in the database
    else{
        id=1;       
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        season: req.body.season,
        label: req.body.label,
        color: req.body.color,
        price: req.body.price,
        description: req.body.description,
    })
    console.log(product);
//      Save product in database
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    })
})

//      Updating product
app.put("/updateproduct", async (req, res) => {
    try {
        const { id, name, price, description, category } = req.body;
        const updatedProduct = await Product.findOneAndUpdate(
            { id: id },
            { $set: {
                'name': name,
                'price': price,
                'description': description,
                'category': category
            } },
            { new: true }
        );
        res.json({ success: true, updatedProduct });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error" });
    }
});

//      Removing product
app.post("/removeproduct", async (req, res) => {
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
})

//      Get products data
app.get("/allproducts", async (req, res) => {
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})

//      Schema for creating users
const Users = mongoose.model("Users", {
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    address: {
        type: String
    },
    role: {
        type: String
    },
    items: {
        type: Object
    },
    password: {
        type: String
    }
})

//      Get users data
app.get("/allusers", async (req, res) => {
    let users = await Users.find({});
    console.log("All userss fetched");
    res.send(users);
})

//      Creating end point for registering
app.post("/register", async (req, res) =>{

//      Check distinct
    let checkEmail = await Users.findOne({email:req.body.email});
    if (checkEmail) {
        return res.status(400).json({success:false, errors: "Email was already in use"})
    }

    let checkPhone = await Users.findOne({phone:req.body.phone});
    if (checkPhone) {
        return res.status(400).json({success:false, errors: "Phone number was already in use"})
    }

    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        role: req.body.role,
        items: [],
        password: req.body.password,
    })

    await user.save();

    const data = {
        user:{
            id: user.id
        }
    }

    const token = jwt.sign(data, "secret_ecom");
    res.json({success:true, token})
})

//      Creating endpoint for logging in
app.post("/login", async (req, res) =>{
    let user = await Users.findOne({email:req.body.email}).lean();
    if (user){
        const passwordCheck = req.body.password === user.password
        if (passwordCheck) {
            const data = {
                user: {
                    ...user,
                    id: user.id
                }
            }
            const token = jwt.sign(data, "secret_ecom");
            res.json({success:true, token});
        }
        else{
            res.json({success:false, errors: "Wrong password"})
        }
    }
    else{
        res.json({success:false, errors: "Wrong email"})
    }
})

//      Creating endpoint for new collection
app.get("/newcollection", async (req, res) =>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-4);
    console.log("New collection fetched");
    res.send(newcollection)
})

//      Get product with ids
app.post("/get-product-by-id", async (req, res) => {
    try {
        const productIds = req.body.recommendations;

        if (!productIds || !Array.isArray(productIds)) {
            return res.status(400).json({ error: 'Invalid product IDs provided' });
        }

        const products = await Product.find({ id: { $in: productIds } });
        const productsById = productIds.map(productId => {
            const product = products.find(p => p.id.toString() === productId);
            return product ? product : { id: productId, error: 'Product not found' };
        });

        res.send(productsById);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log(error);
    }
});

//      Creating middleware to fetch user
const fetchUser = async (req, res, next)=>{
    const token = req.header("auth-token");
    if (!token){
        res.status(401).send({errors:"Need to use valid token"})
    }
    else{
        try {
            const data = jwt.verify(token, "secret_ecom");
            req.user = data.user;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).send({errors:"Not working"})
        }
    }
}

//      Get user profile
app.get("/profile", fetchUser, async (req, res) => {
    let userId = req.user._id ? req.user._id : req.user.id;
    let userData = await Users.findOne({ _id: userId });
    res.send(userData);
});

//      Updating user profile
app.put("/updateprofile",fetchUser, async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const updatedProfile = await Users.findOneAndUpdate(
            { email: email },
            { $set: {
                'name': name,
                'phone': phone,
                'address': address
            } },
            { new: true }
        );
        res.json({ success: true, updatedProfile });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error" });
    }
});

//      Updating user role
app.put("/update-user-role", async (req, res) => {
    try {
        const { email, role } = req.body;
        const updatedProfile = await Users.findOneAndUpdate(
            { email: email },
            { $set: {
                'role': role
            } },
            { new: true }
        );
        res.json({ success: true, updatedProfile });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error" });
    }
});

//      Remove user
app.post("/removeuser", async (req, res) => {
    await Users.findOneAndDelete({email:req.body.email});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
})

//      Delete account
app.post("/deleteaccount", fetchUser, async (req, res) => {
    let userId = req.user._id ? req.user._id : req.user.id;
    await Users.findOneAndDelete({_id: userId});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
})

//      Creat schema for orders
const Orders = mongoose.model("Orders", {
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String
    },
    cartItems: {
        type: Object
    },
    total: {
        type: Number
    },
    deliver: {
        type: Boolean
    },
    }
)

//      Create orders
app.post("/create-order", fetchUser, async (req, res) =>{
    let orders = await Orders.find({});
//      Generate id automatically
    let id;
    if(orders.length>0){
        let last_order_array = orders.slice(-1);
        let last_order = last_order_array[0];
        id = last_order.id+1;
    }
//       If there is no product in the database
    else{
        id=1;       
    }
    let userId = req.user._id ? req.user._id : req.user.id;
    let userData = await Users.findOne({_id:userId})

    const order = new Orders({
        id: id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        cartItems: req.body.cartItems,
        total: req.body.total,
        deliver: false,
    })
    await order.save()
    res.json({
        success: true,
    })
})

//      Get user orders
app.get("/my-orders", fetchUser, async (req, res) =>{
    let userId = req.user._id ? req.user._id : req.user.id;
    const userData = await Users.findOne({_id:userId})
    const orders = await Orders.find({
        'email': userData.email
    });
    res.send(orders);
})

//      Update order's deliver
app.put("/update-order-deliver", async (req, res) => {
    try {
        const { id, deliver } = req.body;
        const updatedOrder = await Orders.findOneAndUpdate(
            { id: id },
            { $set: {
                deliver,
            } },
            { new: true }
        );
        res.json({ success: true, updatedOrder });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error" });
    }
});

//      Get orders data
app.get("/allorders", async (req, res) => {
    let orders = await Orders.find({});
    console.log("All orders fetched");
    res.send(orders);
})


app.listen(port,(error)=>{
    if(!error){
        console.log("Server is running on port "+ port);
    }else{
        console.log("Error"+ error);
    }
})