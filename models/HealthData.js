// const mongoose = require('mongoose')

// //schema

// const HealthDataSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link data to user
//     age : { type : Number , required : true  },
//     gender : {type : String , required : true , enum : ["Male","Female"]},
//     bmi: { type: Number, required: true },
//     bloodPressure: { type: Number, required: true },
//     cholesterol: { type: String, enum: ["Normal", "High", "Very High"], required: true },
//     diabetes: { type: Boolean, required: true },
//     heartDiseaseRisk: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
// }, { timestamps: true })



// module.exports = mongoose.model("HealthData",HealthDataSchema)



const mongoose = require("mongoose");

const HealthDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ userId is required
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    bmi: { type: Number, required: true },
    bloodPressure: { type: Number, required: true },
    cholesterol: { type: String, enum: ["Normal", "High", "Very High"], required: true },
    diabetes: { type: Boolean, required: true },
    heartDiseaseRisk: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
}, { timestamps: true ,collection: "healthdata" });

module.exports = mongoose.model("HealthData", HealthDataSchema);
