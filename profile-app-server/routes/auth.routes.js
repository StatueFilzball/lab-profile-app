const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const router = express.Router();
const saltRounds = 10;

// POST  /auth/signup
router.post("/signup", (req, res) => {
    const {username, password, campus, course} = req.body

    if (username === '' || password === '' || campus === '' || course === '') {
        res.status(400).json({ message: "Provide email, password and name" });
        return;
      }

   // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
     res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
     return;
     }     
 
    User.findOne({ username })
     .then(async (foundUser) => {
    // If the user with the same email already exists, send an error response
    if (foundUser) {
         res.status(400).json({ message: "User already exists." });
         return;
     }

     const passwordHash = await bcrypt.hash(password, saltRounds)
     return User.create({username, password: passwordHash, campus, course})
     })
     .then(createdUser => {
         const user = {_id: createdUser._id, username: createdUser.username, campus: createdUser.campus, course: createdUser.course};
         return res.status(201).json({ user })
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({ message: "Internal Server Error" })
       });    
})


// POST  /auth/login
router.post("/login", (req, res) => {

    const {username, password } = req.body;

    if (username === '' || password === '') {
        res.status(400).json({ message: "Provide username and password." });
        return;
      }

    User.findOne({ username })
        .then((foundUser) => {
        if (!foundUser) {
            // If the user is not found, send an error response
            res.status(401).json({ message: "User not found." })
            return;
        }
    
        // Compare the provided password with the one saved in the database
        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
    
        if (passwordCorrect) {
           console.log("CORRECT PASSWORD")
            // Deconstruct the user object to omit the password
            const { _id, username, campus, course } = foundUser;
            
            // Create an object that will be set as the token payload
            const payload = { _id, username, campus, course  };
            console.log("PAYLOAD", payload)
            // Create and sign the token
            const authToken = jwt.sign( 
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: "6h" }
            );
            console.log("AUTHTOKEN", authToken)

    
            // Send the token as the response
            res.status(200).json({ authToken: authToken });
        }
        else {
            res.status(401).json({ message: "Unable to authenticate the user" });
        }

        })
        .catch(err => res.status(500).json({ message: "Internal Server Error" }));
    
})


// GET  /auth/verify
router.get('/verify', (req, res, next) => {       // <== CREATE NEW ROUTE
 
    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log(`req.payload`, req.payload);
   
    // Send back the object with user data
    // previously set as the token payload
    res.status(200).json(req.payload);
  });

  module.exports= router