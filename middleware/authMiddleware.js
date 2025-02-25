const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    console.log("Received Token:", token); 

    if (!token) {
        return res.status(401).json({ error: "Access Denied. No token provided." });
    }

    try {
        const cleanToken = token.replace("Bearer ", "").trim(); 
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); 

        req.user = decoded; 
        console.log("Decoded Token:", decoded);
        console.log("req.user:", req.user);  

        if (!req.user._id) {
            return res.status(400).json({ error: "User ID is missing from token" });
        }
        next();
    } catch (error) {
        console.log("Token Error:", error.message);
        res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;
