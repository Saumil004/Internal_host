from flask import Flask, request, jsonify
import numpy as np
from PIL import Image
import io
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.utils import custom_object_scope
from tensorflow.keras.layers import Lambda 
from flask_cors import CORS
import pickle
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)
tuberculosis_model = load_model('./models/tuberculosis_cnn_model.h5')

thyroid_scaler = joblib.load('models/thyroid_scaler.joblib')
thyroid_model = load_model('./models/thyroid_model.keras')

heart_scaler = joblib.load('models/heart_scaler.joblib')
heart_model = joblib.load('models/heart_model2.joblib')
diabetes_model = joblib.load('models/diabetes_xgboost_model.joblib')
kidney_model = joblib.load('models/kidney_gb_model.joblib')
liver_model = joblib.load('models/liverxgb.joblib')

# Function to preprocess data
def preprocess_data(data):
    # Normalize the data
    for x in data:
        data[x] = (data[x] - data[x].min()) / (data[x].max() - data[x].min())
    return data

def predict_tuberculosis(image_path):
    try:
        img_size = 256
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        img = cv2.resize(img, (img_size, img_size))
        img = img / 255.0
        img = np.reshape(img, (1, img_size, img_size, 1))

        predictions = tuberculosis_model.predict(img)
        value = round(predictions[0][0], 4)
        
        if value < 0.5:
            return "Tuberculosis detected"
        else:
            return "Tuberculosis not detected"

    except Exception as e:
        print(f"Error: {e}")
        return "Error occurred during prediction"

@app.route('/TB', methods=['POST'])
def TB():
    if request.method == 'POST':
        file = request.files['file']
        img = Image.open(io.BytesIO(file.read()))
        temp_image_path = 'uploads/TB_image.jpg'
        img.save(temp_image_path)
        prediction_result = predict_tuberculosis(temp_image_path)
        return jsonify({"response": prediction_result})

@app.route('/liver', methods=["POST"])
def liver():
    if request.method == 'POST':
        age = int(request.json.get('Age'))
        m = request.json.get('Gender')
        if m == "Male":
            gender = 1
        else:
            gender = 0
        total_bilirubin = float(request.json.get('total_bilirubin'))
        direct_bilirubin = float(request.json.get('direct_bilirubin'))
        alkphos = float(request.json.get('alkphos'))
        sgpt = float(request.json.get('sgpt'))
        sgot = float(request.json.get('sgot'))
        total_proteins = float(request.json.get('total_proteins'))
        alb = float(request.json.get('alb'))
        ag_ratio = float(request.json.get('ag_ratio'))
        gb_ratio = float(request.json.get('gb_ratio'))
        features = np.array([age, gender, total_bilirubin, direct_bilirubin, alkphos,
                             sgpt, sgot, total_proteins, alb, ag_ratio]).reshape(1, 10)
        prediction = liver_model.predict(features).tolist()
        ans = str(prediction[0])
        return jsonify({"response": ans})

@app.route("/thyroid", methods=['POST'])
def thyroid():
    const = 1
    age = request.json.get('Age')
    m = request.json.get('Gender')
    if (m == "Male"):
        sex = 0
    else:
        sex = 1
    on_thyroxine = request.json.get('on_thyroxine')
    query_on_thyrxine = request.json.get('query_on_thyrxine')
    on_anti_med = request.json.get('on_anti_med')
    sick = request.json.get('sick')
    pregnant = request.json.get('pregnant')
    thyroid_surgery = request.json.get('thyroid_surgery')
    I131_treatment = request.json.get('I131_treatment')
    query_hypothyroid = request.json.get('query_hypothyroid')
    query_hyperthyroid = request.json.get('query_hyperthyroid')
    lithium = request.json.get('lithium')
    goitre = request.json.get('goitre')
    tumor = request.json.get('tumor')
    hypopituitary = request.json.get('hypopituitary')
    psych = request.json.get('psych')
    TSH_measured =request.json.get('TSH_measured')
    TSH = request.json.get('TSH')
    T3_measured = request.json.get('T3_measured')
    T3 = request.json.get('T3')
    TT4_measured = request.json.get('TT4_measured')
    TT4 = request.json.get('TT4')
    T4U_measured = request.json.get('T4U_measured')
    T4U = request.json.get('T4U')
    FTI_measured = request.json.get('FTI_measured')
    FTI = request.json.get('FTI')
    TBG_measured = request.json.get('TBG_measured')
    features = np.array([const, age, sex, on_thyroxine, query_on_thyrxine, on_anti_med,
                             sick, pregnant, thyroid_surgery, I131_treatment,
                             query_hypothyroid, query_hyperthyroid, lithium, goitre, tumor, hypopituitary, psych, TSH_measured, TSH, T3_measured,
                             T3, TT4_measured, TT4, T4U_measured, T4U,
                             FTI_measured, FTI, TBG_measured]).reshape(1, -1)
   
    processed = thyroid_scaler.transform(features)
    prediction = thyroid_model.predict(processed).tolist()[0]
    print(prediction)
    return jsonify({"response": prediction})

@app.route('/Heart', methods=['POST'])
def Heart():
    age_in_years = float(request.json.get('Age', 0))
    m = request.json.get('Gender', 0)
    if (m == "Male"):
        sex_male_1_female_0 = 1
    else:
        sex_male_1_female_0 = 0
    chest_pain_type = float(request.json.get('chest_pain_type', 0))
    resting_blood_pressure_mm_hg = float(request.json.get('resting_blood_pressure_mm_hg', 0))
    serum_cholesterol_mg_dl = float(request.json.get('serum_cholesterol_mg_dl', 0))
    fasting_blood_sugar_gt_120_mg_dl_1_true_0_false = float(request.json.get('fasting_blood_sugar_gt_120_mg_dl_1_true_0_false', 0))
    resting_electrocardiographic_results = float(request.json.get('resting_electrocardiographic_results', 0))
    max_heart_rate_achieved = float(request.json.get('max_heart_rate_achieved', 0))
    exercise_induced_angina_1_yes_0_no = float(request.json.get('exercise_induced_angina_1_yes_0_no', 0))
    st_depression_exercise_vs_rest = float(request.json.get('st_depression_exercise_vs_rest', 0))
    slope_of_peak_exercise_st_segment = float(request.json.get('slope_of_peak_exercise_st_segment', 0))
    num_major_vessels_colored_by_flourosopy = float(request.json.get('num_major_vessels_colored_by_flourosopy', 0))
    thalassemia_type = float(request.json.get('thalassemia_type', 0))

    # Create the numpy array and reshape
    features = np.array([age_in_years, sex_male_1_female_0, chest_pain_type,
                            resting_blood_pressure_mm_hg, serum_cholesterol_mg_dl,
                            fasting_blood_sugar_gt_120_mg_dl_1_true_0_false,
                            resting_electrocardiographic_results, max_heart_rate_achieved,
                            exercise_induced_angina_1_yes_0_no, st_depression_exercise_vs_rest,
                            slope_of_peak_exercise_st_segment, num_major_vessels_colored_by_flourosopy,
                            thalassemia_type]).reshape(1, -1)
    processed = heart_scaler.transform(features)
    predictions = heart_model.predict(processed).tolist()[0]
    return jsonify({"response": predictions})

@app.route('/diabetes', methods=['POST'])
def diabetes():
    Pregnancies = int(request.json.get('Pregnancies'))
    Glucose =  int(request.json.get('Glucose'))
    BloodPressure =  int(request.json.get('BloodPressure'))
    SkinThickness =  int(request.json.get('SkinThickness'))
    Insulin =  int(request.json.get('Insulin'))
    BMI =  int(request.json.get('BMI'))
    DiabetesPedigreeFunction =  float(request.json.get('DiabetesPedigreeFunction'))
    Age =  int(request.json.get('Age'))
    data = np.array([Pregnancies,Glucose,BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age]).reshape(1, -1)
    predictions = diabetes_model.predict(data).tolist()[0]
    return jsonify({"response": predictions})

@app.route('/kidney', methods=["POST"])

def kidney():
    age = int(request.json.get('Age', 0))
    blood_pressure = int(request.json.get('blood_pressure', 0))
    specific_gravity = float(request.json.get('specific_gravity', 0))
    albumin = float(request.json.get('albumin', 0))
    sugar = float(request.json.get('sugar', 0))
    pus_cell = float(request.json.get('pus_cell', 0))
    pus_cell_clumps = float(request.json.get('pus_cell_clumps', 0))
    blood_glucose_random = float(request.json.get('blood_glucose_random', 0))
    blood_urea = float(request.json.get('blood_urea', 0))
    serum_creatinine = float(request.json.get('serum_creatinine', 0))
    sodium = float(request.json.get('sodium', 0))
    potassium = float(request.json.get('potassium', 0))
    haemoglobin = float(request.json.get('haemoglobin', 0))
    packed_cell_volume = float(request.json.get('packed_cell_volume', 0))
    white_blood_cell_count = float(request.json.get('white_blood_cell_count', 0))
    red_blood_cell_count = float(request.json.get('red_blood_cell_count', 0))
    hypertension = float(request.json.get('hypertension', 0))
    diabetes_mellitus = float(request.json.get('diabetes_mellitus', 0))
    coronary_artery_disease = float(request.json.get('coronary_artery_disease', 0))
    appetite = float(request.json.get('appetite', 0))
    peda_edema = float(request.json.get('peda_edema', 0))
    anemia = float(request.json.get('aanemia', 0))

    # Create a NumPy array
    data = np.array([age, blood_pressure, specific_gravity, albumin, sugar, 
                            pus_cell, pus_cell_clumps, blood_glucose_random, blood_urea,
                            serum_creatinine, sodium, potassium, haemoglobin,
                            packed_cell_volume, white_blood_cell_count, red_blood_cell_count,
                            hypertension, diabetes_mellitus, coronary_artery_disease,
                            appetite, peda_edema, anemia]).reshape(1, -1)
    
    predictions = kidney_model.predict(data).tolist()[0]
    return jsonify({"response": predictions})

if __name__ == '__main__':
    app.run(debug=True)
