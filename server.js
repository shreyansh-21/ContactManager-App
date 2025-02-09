const express = require("express")
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const { connect } = require("mongoose");


connectDB();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json())
app.use(errorHandler)
app.use("/api/contacts",require("./routes/contactRoutes"))
app.use("/api/users",require("./routes/userRoutes"))
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
