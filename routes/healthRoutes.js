const express = require('express')
const HealthData = require('../models/HealthData')
const authMiddleware = require("../middleware/authMiddleware")
const router =  express.Router()

router.post("/",async (req,res) =>
{
    try{
        
        const age = req.body.age
        const gender = req.body.gender
        const bmi = req.body.bmi
        const bloodPressure = req.body.bloodPressure
        const cholesterol = req.body.cholesterol
        const diabetes = req.body.diabetes
        
        const healthEntry = new HealthData({
            age, gender, bmi, bloodPressure, cholesterol, diabetes    
        })
        
        await healthEntry.save();
        res.status(201).json({message: "health Data saved Succesfully",data: healthEntry })
    }
    catch(error)
    {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})


router.get('/', async (req,res)=>{
    try{
        const records = await HealthData.find()
        res.json(records)
    }
    catch(error)
    {
        res.status(500).json({message : "server error", error: error.message})
    }
})


router.get("/mydata", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId; 
        
        const healthData = await HealthData.find({ userId: req.user._id });
        console.log("Fetched Health Data:", healthData);

        if (!healthData.length) {
            return res.status(404).json({ message: "No health data found for this user." });
        }

        res.json(healthData);
    } catch (error) {
        res.status(500).json({ error: "Error fetching health data" });
    }
});


router.post("/submit-health-data", authMiddleware, async (req, res) => {
    try {
        console.log("Request User:", req.user);  

        const userId = req.user._id;
        console.log("Extracted User ID:", userId);

        if (!userId) {
            return res.status(400).json({ error: "User ID is missing from token" });
        }

        const healthData = new HealthData({
            userId,
            age: req.body.age,
            gender: req.body.gender,
            bmi: req.body.bmi,
            bloodPressure: req.body.bloodPressure,
            cholesterol: req.body.cholesterol,
            diabetes: req.body.diabetes,
            heartDiseaseRisk: req.body.heartDiseaseRisk
        });

        await healthData.save();
        res.status(201).json({ message: "Health data saved successfully", healthData });
    } catch (error) {
        console.error("Error saving health data:", error.message);  
        res.status(500).json({ message: "Server error", error: error.message });
    }
});




router.get("/mydata", authMiddleware, async (req, res) => {
    try {
        console.log("Authenticated User:", req.user);  
        const userId = req.user._id;  
        console.log("Extracted User ID:", userId);

        
        const objectIdUserId = new mongoose.Types.ObjectId(userId);
        console.log("Converted to ObjectId:", objectIdUserId);

        const healthData = await HealthData.find({ userId: objectIdUserId });

        console.log("Query Result:", healthData);  
        if (!healthData.length) {
            console.log("No data found for user:", objectIdUserId);
            return res.status(404).json({ message: "No health data found for this user." });
        }

        res.json(healthData);
    } catch (error) {
        console.error("Error fetching health data:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});




module.exports = router ;