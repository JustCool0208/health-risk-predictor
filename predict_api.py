# 

from fastapi import FastAPI, Request, HTTPException
import joblib
import numpy as np
import jwt
from pymongo import MongoClient
from pydantic import BaseModel

# Load trained model
model = joblib.load("best_model.pkl")

# MongoDB setup (REMOVE DUPLICATES)
client = MongoClient("mongodb://localhost:27017")  # Local MongoDB connection
db = client["health_db"]
health_collection = db["health_data"]  # Ensure correct collection name

# JWT Configuration
SECRET_KEY = "your_secret_key"  # Replace with your actual secret key
ALGORITHM = "HS256"

app = FastAPI()

# Base request structure
class HealthInput(BaseModel):
    age: int
    gender: str
    bmi: float
    bloodPressure: float
    cholesterol: str
    diabetes: bool

# Mapping dictionaries
gender_map = {"Male": 0, "Female": 1}
cholesterol_map = {"Normal": 0, "High": 1, "Very High": 2}
risk_map = {0: "Low", 1: "Medium", 2: "High"}

# Function to get user ID from token
def get_user_from_token(token: str):
    """Decode JWT and return the user ID"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["_id"]  # Extract user ID from token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/predict")
def predict_risk(data: HealthInput):
    """Predict heart disease risk"""
    try:
        input_data = np.array([
            data.age,
            gender_map[data.gender],
            data.bmi,
            data.bloodPressure,  # Fixed field name
            cholesterol_map[data.cholesterol],
            int(data.diabetes)
        ]).reshape(1, -1)

        prediction = model.predict(input_data)[0]
        risk_level = risk_map[prediction]
        return {"heartDiseaseRisk": risk_level}

    except Exception as e:
        return {"error": str(e)}

@app.post("/health-checkup")
async def health_checkup(request: Request):
    """Fetch health data for the authenticated user"""
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token missing or invalid format")

    token = auth_header.split(" ")[1]  # Extract token
    user_id = get_user_from_token(token)  # Get user ID from token

    # Fetch user health data from MongoDB (Ensure user_id is stored as a string)
    health_data = health_collection.find_one({"user_id": user_id}, {"_id": 0})  # Exclude MongoDB ObjectID

    if not health_data:
        raise HTTPException(status_code=404, detail="Health data not found")

    return {"user_id": user_id, "health_data": health_data}
