# Sentiment Analysis Web App

A full-stack web application for sentiment analysis — built with Flask (Python) for the backend and React for the frontend. It lets an admin analyze single texts or bulk texts (via CSV), stores results in a database, and helps companies track and visualize user feedback over time.

## Why This Project

Many companies want to understand customer feedback, reviews, or comments — to gauge satisfaction, detect issues, and improve products or services.  
This app lets only an **authorized admin** upload or input texts for analysis, ensuring that **sensitive user feedback remains safe and controlled**.  
By analysing polarity, subjectivity and sentiment (positive / neutral / negative), companies can see trends in customer sentiment and use that data to guide decisions.

## Features

- Analyze sentiment (polarity & subjectivity) of single text input.  
- Upload a CSV file to analyze a batch of texts.  
- Classify sentiment as **Positive**, **Neutral**, or **Negative**.  
- Store results in a MySQL database for future retrieval.  
- Designed for business-use: only admin can perform analysis or upload CSVs.  
- Frontend built using React, backend using Flask + TextBlob + MySQL.  

## Tech Stack

- **Backend:** Python, Flask, TextBlob, MySQL (mysql-connector-python)  
- **Frontend:** React, Axios  
- **Other:** Flask-CORS for cross-origin support, CSV handling for bulk upload  

## How to Run (Very Simple)
1️⃣ Start Backend (Flask)
  * cd backend
  * pip install -r requirements.txt
  * python app.py
    
2️⃣ Start Frontend (React)
  * cd frontend
  * npm install
  * npm start


## Result 

After login, the admin can:

- Enter a single text and get sentiment result  
  → polarity, subjectivity, and classification (Positive / Neutral / Negative)

- Upload a CSV file to analyze multiple rows at once  
  → results will be displayed and stored in MySQL

- View stored analysis data later for visualization(graphs)  
  



