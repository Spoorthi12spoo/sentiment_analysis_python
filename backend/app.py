from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import mysql.connector
from mysql.connector import Error
from werkzeug.utils import secure_filename
import os
import csv

app = Flask(__name__)
CORS(app)

# --- MySQL connection helper ---
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Spoo@242004",
    database="sentiment_db"
)

def get_conn():
    """Return a live MySQL connection, reconnecting if needed."""
    global db
    if not db.is_connected():            # check connection status [web:148][web:150]
        db.reconnect(attempts=3, delay=2)  # try to reconnect [web:145]
    return db

# --- File upload config ---
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Helper: sentiment analysis ---
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
    return {
        "text": text,
        "polarity": polarity,
        "subjectivity": subjectivity,
        "sentiment": sentiment
    }

# --- Admin login API ---
@app.route('/api/adminlogin', methods=['POST'])
def admin_login():
    try:
        data = request.get_json(silent=True) or {}
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        conn = get_conn()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM admins WHERE email=%s AND password=%s",
            (email, password)
        )
        admin = cursor.fetchone()
        cursor.close()

        if admin:
            return jsonify({"message": "Login successful", "admin": {"email": admin['email']}}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# --- Text sentiment API ---
@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    try:
        data = request.get_json(silent=True) or {}
        text = data.get('text', '')

        if not isinstance(text, str) or not text.strip():
            return jsonify({"error": "Field 'text' is required and must be non-empty"}), 400

        result = analyze_sentiment(text)

        conn = get_conn()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO analyses (input_text, polarity, subjectivity, sentiment) "
            "VALUES (%s, %s, %s, %s)",
            (text, result['polarity'], result['subjectivity'], result['sentiment'])
        )
        conn.commit()
        cursor.close()

        return jsonify(result), 200

    except Error as e:
        conn = get_conn()
        conn.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- CSV upload API ---
@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        results = []
        conn = get_conn()
        cursor = conn.cursor(dictionary=True)
        with open(filepath, newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if row:
                    text = row[0]
                    analysis = analyze_sentiment(text)
                    results.append(analysis)
                    cursor.execute(
                        "INSERT INTO analyses (input_text, polarity, subjectivity, sentiment) "
                        "VALUES (%s, %s, %s, %s)",
                        (text, analysis['polarity'], analysis['subjectivity'], analysis['sentiment'])
                    )
        conn.commit()
        cursor.close()

        return jsonify(results), 200

    except Error as e:
        conn = get_conn()
        conn.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# --- Analysis data API ---
@app.route('/api/analysis-data', methods=['GET'])
def get_analysis_data():
    try:
        conn = get_conn()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT polarity, subjectivity FROM analyses")
        data = cursor.fetchall()
        cursor.close()
        return jsonify(data), 200
    except Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@app.route('/')
def home():
    return "Flask backend running!"

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=5000)
