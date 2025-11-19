# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import mysql.connector
from werkzeug.utils import secure_filename
import os
import csv
import io

app = Flask(__name__)
CORS(app)

# MySQL connection setup
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Spoo@242004",
    database="sentiment_db"
)
cursor = db.cursor(dictionary=True)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper function to analyze sentiment
def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    if polarity > 0:
        sentiment = "Positive"
    elif polarity < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
    return {"text": text, "polarity": polarity, "subjectivity": subjectivity, "sentiment": sentiment}

# Admin login API
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    print("Email received:", repr(email))
    print("Password received:", repr(password))
    cursor.execute("SELECT * FROM admins WHERE email=%s AND password=%s", (email, password))
    admin = cursor.fetchone()
    print("Query result:", admin)
    if admin:
        return jsonify({"message": "Login successful", "admin": {"email": admin['email']}}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401


# User input text sentiment analysis API
@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    data = request.json
    text = data.get('text', '')
    if not text.strip():
        return jsonify({"error": "Empty text"}), 400
    
    result = analyze_sentiment(text)
    # Optionally store to DB here
    cursor.execute("INSERT INTO analyses (input_text, polarity, subjectivity, sentiment) VALUES (%s, %s, %s, %s)",
                   (text, result['polarity'], result['subjectivity'], result['sentiment']))
    db.commit()
    return jsonify(result), 200

# CSV upload and sentiment analysis API
@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    results = []
    with open(filepath, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if row: 
                text = row[0]
                analysis = analyze_sentiment(text)
                results.append(analysis)
                # Store in DB as well
                cursor.execute("INSERT INTO analyses (input_text, polarity, subjectivity, sentiment) VALUES (%s, %s, %s, %s)",
                               (text, analysis['polarity'], analysis['subjectivity'], analysis['sentiment']))
    db.commit()
    return jsonify(results), 200

# API to get sentiment data for analysis page
@app.route('/api/analysis-data', methods=['GET'])
def get_analysis_data():
    cursor.execute("SELECT polarity, subjectivity FROM analyses")
    data = cursor.fetchall()
    return jsonify(data), 200

if __name__ == "__main__":
    app.run(debug=True)
