require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());


mongoose.connect(process.env.mongodb_url)
.then (()=>{
   console.log("database is connected")
}) 
.catch((error)=>{
        console.log("Database connection failed",error);
})


const bookRoutes = require("./routes/bookRoutes");

app.use("/api/books", bookRoutes);
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});






