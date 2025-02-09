const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// @desc Register a new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async(req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if(userAvailable){
        res.status(400);
        throw new Error("User already exists");
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await User.create({ username, email, password: hashedPassword });
    console.log("user created", user);
    if(user){
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });}
    else{
        res.status(400);
        throw new Error("Invalid user data");
    }
    
    
    res.json({ message: "Register the user" });
});



// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }
  
    const user = await User.findOne({ email });
  
    // Compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user._id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
  });
  

// @desc Get current user
// @route GET /api/users/current
// @access Private
const CurrentUser = asyncHandler(async(req, res) => {
    res.json(req.user);
});

module.exports = { registerUser , loginUser, CurrentUser};