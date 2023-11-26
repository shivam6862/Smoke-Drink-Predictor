# Import necessary libraries
from sklearn.preprocessing import StandardScaler
import pandas as pd
import csv
import os
import sys
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB

# Define the upload folder
UPLOAD_FOLDER = 'uploads'
csv_file_path = "data.csv"
# Add the current directory to the system path
sys.path.append(os.getcwd())


class Models:
    def __init__(self):
        # Initialize Linear Regression and Logistic Regression models and decision tree
        print("Initializing models...")
        self.logisticRegression_smoker = LogisticRegression(max_iter=2000)
        self.logisticRegression_drinker = LogisticRegression(max_iter=2000)
        self.gaussianNB_smoker = GaussianNB()
        self.gaussianNB_drinker = GaussianNB()
        self.scaler_smoker = StandardScaler()
        self.scaler_drinker = StandardScaler()
        print("Models initialized!")

        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        print("Model created!")

        updated_data = []

        # Read existing data from the CSV file and update start_angle for the first row
        with open(csv_file_path, mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if reader.line_num == 1:
                    row['start_angle'] = 10.0
                updated_data.append(row)

        updated_data_df = pd.DataFrame(updated_data)
        X_train = updated_data_df.drop(columns=["SMK_stat_type_cd", "DRK_YN"])
        y_train_smoker = updated_data_df["SMK_stat_type_cd"]
        y_train_drinker = updated_data_df["DRK_YN"]

        print(X_train.head())
        print(y_train_smoker.head())
        print(y_train_drinker.head())
        print("Dataframe created")

        # Scale the data
        self.scaler_smoker.fit_transform(X_train)
        self.scaler_drinker.fit_transform(X_train)
        print("Worked till scaler")

        print("Columns", X_train.columns)

        # Fit the models
        self.logisticRegression_smoker.fit(X_train, y_train_smoker)
        self.logisticRegression_drinker.fit(X_train, y_train_drinker)
        print("Worked till fit logistic regression")
        self.gaussianNB_smoker.fit(X_train, y_train_smoker)
        self.gaussianNB_drinker.fit(X_train, y_train_drinker)
        print("Worked till fit gaussianNB")

        print("CSV file updated successfully.")

    def model(self, dataset):
        # Initialize Linear Regression and Logistic Regression models and decision tree
        scaler_smoker = self.scaler_smoker
        scaler_drinker = self.scaler_drinker
        logistic_regression_smoker_reg = self.logisticRegression_smoker
        logistic_regression_drinker_reg = self.logisticRegression_drinker

        # Read existing data from the CSV file and update start_angle for the first row
        updated_data = [dataset]

        updated_data_df = pd.DataFrame(updated_data)
        print("updated_data_df\n", updated_data_df)
        print("updated_data_df\n", updated_data_df.columns)

        X_test = updated_data_df

        X_test_for_smoker = scaler_smoker.transform(
            X_test)
        X_test_for_drinker = scaler_drinker.transform(
            X_test)
        print("Worked till here scaler")

        # Logistic Regression
        logistic_regression_smoker_reg_preds = logistic_regression_smoker_reg.predict_proba(
            X_test_for_smoker)
        logistic_regression_drinker_reg_preds = logistic_regression_drinker_reg.predict_proba(
            X_test_for_drinker)
        print("logistic_regression_reg_preds",
              logistic_regression_smoker_reg_preds)
        print("logistic_regression_reg_preds",
              logistic_regression_drinker_reg_preds)
        max_index_value_smoker = logistic_regression_smoker_reg_preds.argmax()
        max_index_value_drinker = logistic_regression_drinker_reg_preds.argmax()
        print("max_index_value_smoker", max_index_value_smoker)
        print("max_index_value_drinker", max_index_value_drinker)

        # Naive Bayes
        gaussianNB_smoker_reg_preds = self.gaussianNB_smoker.predict_proba(
            X_test)
        gaussianNB_drinker_reg_preds = self.gaussianNB_drinker.predict_proba(
            X_test)
        print("gaussianNB_reg_preds", gaussianNB_smoker_reg_preds)
        print("gaussianNB_reg_preds", gaussianNB_drinker_reg_preds)
        max_index_value_smoker = gaussianNB_smoker_reg_preds.argmax()
        max_index_value_drinker = gaussianNB_drinker_reg_preds.argmax()
        print("max_index_value_smoker", max_index_value_smoker)
        print("max_index_value_drinker", max_index_value_drinker)

        smoking_status = ["Never Smoked", "Former Smoker", "Current Smoker"]
        drinking_status = ["Never Drank", "Current Drinker"]

        predictions_df = [{
            'Logistic Regression': {
                "smoking": {
                    "result": smoking_status[max_index_value_smoker],
                    "probability": "class 1: " + str(logistic_regression_smoker_reg_preds[0][0])+" ,class 2:"+str(logistic_regression_smoker_reg_preds[0][1])+" ,class 3:"+str(logistic_regression_smoker_reg_preds[0][2]),
                },
                "drinking": {
                    "result": drinking_status[max_index_value_drinker],
                    "probability": "class 1: " + str(logistic_regression_drinker_reg_preds[0][0]) + " ,class 2: " + str(logistic_regression_drinker_reg_preds[0][1]),
                },
            },
            'Naive Bayes': {
                "smoking": {
                    "result": smoking_status[max_index_value_smoker],
                    "probability": "class 1: " + str(gaussianNB_smoker_reg_preds[0][0]) + " ,class 2: " + str(gaussianNB_smoker_reg_preds[0][1]) + " ,class 3: " + str(gaussianNB_smoker_reg_preds[0][2]),
                },
                "drinking": {
                    "result": drinking_status[max_index_value_drinker],
                    "probability": "class 1: " + str(gaussianNB_drinker_reg_preds[0][0]) + " ,class 2: " + str(gaussianNB_drinker_reg_preds[0][1]),
                },
            },
        }]
        print("predictions_df", predictions_df)

        return predictions_df
