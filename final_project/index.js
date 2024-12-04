const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const SECRET = "fingerprint_customer";
const app = express();

app.use(cookieParser()); 
app.use(express.json());

app.use("/customer",session({secret:SECRET,resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here

    console.log('>>auth ');
    //console.log(req.cookies);
    
    let token = null;
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    
    if (!token) {
        return res.status(401).json({message: "Access denied."});
    }

    const decoded = jwt.verify(token, SECRET);
    if (!decoded) {
        return res.status(401).json({message: "Invalid token."});
    }  
    res.status(200);
    next();
});

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
