from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pdfplumber
import os
from dotenv import load_dotenv
from openai import OpenAI

# ---------------- CONFIG ----------------
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client_ai = OpenAI(api_key=api_key) if api_key else None

app = Flask(__name__)
CORS(app)

# MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["smarthire_ai"]
collection = db["resume_analysis"]

# ---------------- PDF TEXT EXTRACTION ----------------
def extract_text(file):
    text = ""
    file.seek(0)

    try:
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print("PDF ERROR:", e)

    return text


# ---------------- FALLBACK LOGIC ----------------
def basic_analysis(text):
    lower = text.lower()

    skills_list = [
        "python", "java", "c++", "javascript", "react", "node",
        "mongodb", "sql", "html", "css", "flask",
        "communication", "leadership", "excel",
        "recruitment", "hr", "marketing", "sales"
    ]

    skills_found = [s.title() for s in skills_list if s in lower]

    if any(x in lower for x in ["python", "react", "javascript", "node"]):
        role = "Technical Candidate"
        required = ["Python", "React", "JavaScript", "MongoDB"]
    elif "hr" in lower or "recruitment" in lower:
        role = "HR Candidate"
        required = ["Communication", "Recruitment", "Excel"]
    elif "marketing" in lower or "sales" in lower:
        role = "Marketing Candidate"
        required = ["Marketing", "Sales", "Communication"]
    else:
        role = "General Candidate"
        required = ["Communication", "Leadership"]

    missing = [r for r in required if r.lower() not in lower]

    score = min(100, 40 + len(skills_found) * 8)
    job_readiness = max(20, score - len(missing) * 5)
    job_matches = max(1, len(skills_found) * 2)

    return {
        "detected_role": role,
        "skills_found": skills_found,
        "missing_skills": missing,
        "score": score,
        "job_readiness": job_readiness,
        "job_matches": job_matches
    }


# ---------------- AI ANALYSIS ----------------
def analyze_with_ai(text):
    prompt = f"""
Return ONLY JSON:

{{
  "file_meta": {{
    "name": "",
    "size_mb": 0,
    "updated": ""
  }},
  "ats_score": 0,
  "ats_breakdown": {{
    "keyword_match": 0,
    "formatting": 0,
    "experience_clarity": 0
  }},
  "skills_found": [],
  "missing_skills": [
    {{ "skill": "", "priority": "Critical|High|Medium" }}
  ],
  "resume_tips": []
}}

Resume:
{text}
"""

    response = client_ai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    import json
    raw = response.choices[0].message.content

    try:
        return json.loads(raw)
    except:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        return json.loads(raw[start:end])


# ---------------- ROUTES ----------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "SmartHire AI Backend Running 🚀"})


@app.route("/analyze-resume", methods=["POST"])
def analyze_resume():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        text = extract_text(file)

        print("\n===== EXTRACTED TEXT =====\n", text[:500])

        if not text.strip():
            return jsonify({"error": "No text extracted"}), 400

        # 🔥 TRY AI FIRST
        if client_ai:
            try:
                data = analyze_with_ai(text)
                print("\n===== AI SUCCESS =====\n", data)

            except Exception as e:
                print("AI FAILED:", e)
                data = basic_analysis(text)
        else:
            print("NO API KEY — USING BASIC ANALYSIS")
            data = basic_analysis(text)

        # Save to MongoDB
        collection.insert_one({
            "resume_text": text,
            "analysis": data
        })

        return jsonify(data), 200

    except Exception as e:
        print("SERVER ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False, port=5000)