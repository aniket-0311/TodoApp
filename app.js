if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');


const app = express();

// Mongoose Connection
const dbURL = process.env.DB_CONNECT;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, });

const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, 'MongoDB connection error:'));
db.once("open", () => {
    console.log("Database Connected");
})

// Import routes
const userRoute = require("./routes/user");
const todoRoute = require("./routes/todo");

//Setting up view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views")); 



// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Middleware for routes
app.use("/api/user", userRoute);
app.use("/api/todos/:id", todoRoute);

// Get Req
app.get("/api",(req,res) =>{
    res.render("index");
});



// App Serving on port
app.listen(7000, ()=>{
    console.log("Serving on port 7000");
});