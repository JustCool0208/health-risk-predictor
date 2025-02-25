from pymongo import MongoClient
import pandas as pd
import random

client = MongoClient("mongodb://localhost:27017")
db = client["health_db"]
collection = db["health_records"]

data = []
for i in range (100): #generate 100 records
    record = {
        "age": random.randint(20, 80),
        "gender": random.choice(["Male", "Female"]),
        "bmi": round(random.uniform(18.5, 35.0), 1),
        "bloodpressure": random.randint(90, 180),
        "cholesterol": random.choice(["Normal", "High", "Very High"]),
        "diabetes": random.choice([True, False]),
        "heartDiseaseRisk": random.choice(["Low", "Medium", "High"])
    }
    data.append(record)

collection.insert_many(data)
print("Data inserted")

print("test sample : (just a check)  -->", collection.find_one())