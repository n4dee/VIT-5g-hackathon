
Problem Statement

• Patients often fail to identify health risks at an early stage.

• Delay in connecting with doctors can worsen health conditions.

• Traditional healthcare systems take time to analyze symptoms and provide guidance.

• Using 5G, a smart healthcare website can:

– Instantly analyze patient symptoms

– Predict potential health risks

– Enable real-time doctor connectivity

• This improves early diagnosis, reduces response time, and enhances healthcare accessibility.

Project Overview

• A web-based healthcare platform where users enter their symptoms.

• The system predicts health risk levels as Low, Medium, or High.

• Simulates real-time doctor connection with messages like “Connecting via 5G…”.

• Displays high-risk alerts such as “Immediate medical attention required”.

• Fully software-based project with no hardware requirement.

• Beginner-friendly and achievable within 24 hours.


Core Features
1. Health Risk Prediction


• Users enter symptoms through a web form.

• The system analyzes the input instantly.

• Displays predicted risk level (Low / Medium / High).


2. Doctor Connectivity Simulation

• Website displays simulated real-time doctor connection.

• Shows messages like “Connecting to doctor via 5G…”.


3. Emergency Alerts

• High-risk cases trigger instant alert messages.

• Alerts guide users to seek immediate medical help.
Technology Used

- Python
- FastAPI
- Pydantic
- SQLite
- Rule-based AI logic
- GitHub for version control

---

## How to Run the FastAPI Backend

### 1. Install Dependencies

```bash
cd SmartHealthhackathon
pip install -r requirements.txt
```

### 2. Start the Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Access the API

- **API Docs (Swagger):** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Base URL:** http://localhost:8000

### 4. API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/patient/data` | POST | Store patient data + auto-calculate BMI |
| `/predict/risk` | POST | Health risk prediction (BP, glucose, SpO2) |
| `/lab/analyze` | POST | Lab analysis with abnormal alerts |
| `/predict/disease` | POST | Disease prediction from symptoms |
| `/doctors` | GET | List available doctors |
| `/consult/start` | POST | Start mock consultation |


