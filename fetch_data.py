from pymongo import MongoClient
import pandas as pd

client = MongoClient("mongodb://localhost:27017/")

db = client["health_db"]
collection = db["health_records"]

cursor = collection.find()
df = pd.DataFrame(list(cursor))

df.drop(columns=["_id"],inplace=True)

print(df.head())


from sklearn.model_selection import train_test_split

df.fillna(df.mean(numeric_only=True),inplace = True)

from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()

df["gender"]=le.fit_transform(df["gender"].astype(str))
df["cholesterol"]=le.fit_transform(df["cholesterol"].astype(str))
df["heartDiseaseRisk"]=le.fit_transform(df["heartDiseaseRisk"].astype(str))

print(df.columns)


X = df.drop(columns=["heartDiseaseRisk"])

print(df.columns)

y = df["heartDiseaseRisk"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training Data Shape: {X_train.shape}, Testing Data Shape: {X_test.shape}")




# next step --> models


from sklearn.model_selection import RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import numpy as np

models = {
    "Logistic Regression": LogisticRegression(multi_class="multinomial", solver="lbfgs", max_iter=1000),
    "Random Forest": RandomForestClassifier(),
    "SVM": SVC()
}

param_distributions = {
    "Logistic Regression": {"C": np.logspace(-3, 3, 7)},
    "Random Forest": {"n_estimators": [50, 100, 200], "max_depth": [None, 10, 20]},
    "SVM": {"C": np.logspace(-3, 3, 7), "kernel": ["linear", "rbf"]}
}


#model evaluvation phase

best_model = None
best_score = 0

for name, model in models.items():
    print(f"training {name}")
    search = RandomizedSearchCV(model, param_distributions[name],n_iter=5,cv=3,scoring="accuracy",random_state=42)
    search.fit(X_train, y_train)

    best_model_params = search.best_params_
    best_model = search.best_estimator_

    y_pred = best_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print("\n DONE \n")
    print(f"{name} - best parameter is : {best_model_params}")
    print(f" accuracy of the model ({name}) is : {accuracy:.4f}")

    if accuracy > best_score:
        best_score = accuracy
        final_model = best_model


print("\n DONE \n")
print("\n  \n")
print(f"the best model is {final_model} with an accuracy of {best_score}")
#now save the model

import joblib
joblib.dump(final_model,"best_model.pkl")
print("Done")
