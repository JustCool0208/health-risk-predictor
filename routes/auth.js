const express = require ('express')
const User = require("../models/User")
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists" });

        user = new User({ email, password });  // ✅ Fix: Hashing will be done in UserSchema `pre-save`
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


//login route

router.post("/login", async(req,res)=>
{
    try{
        const email = req.body.email
        const password = req.body.password

        const user = await User.findOne({email})

        if(!user) return res.status(400).json({error : "Invalid email or password"})
    
        const tokenPayload = { _id: user._id };  // Ensure it contains `_id`
        console.log("Token Payload:", tokenPayload);
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
            //dk
        res.json({ token, message: "Login successful" });

    }
    catch(error)
    {
        res.status(500).json({ error: "Server error" });
    }
})


module.exports = router;