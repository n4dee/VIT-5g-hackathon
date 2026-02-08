"""
Smart Healthcare Platform - FastAPI Backend
===========================================
A rule-based AI healthcare API for hackathon use.
Uses SQLite for data persistence and simple rule logic for predictions.
"""

import sqlite3
from contextlib import asynccontextmanager
from fastapi import FastAPI
from pydantic import BaseModel, Field

# =============================================================================
# PYDANTIC MODELS (Request/Response Schemas)
# =============================================================================


class PatientDataInput(BaseModel):
    """Input schema for patient vital and health data."""

    patient_id: str = Field(..., description="Unique patient identifier")
    age: int = Field(..., ge=0, le=150, description="Patient age in years")
    gender: str = Field(..., description="Gender (e.g., Male, Female)")
    height_cm: float = Field(..., gt=0, description="Height in centimeters")
    weight_kg: float = Field(..., gt=0, description="Weight in kilograms")
    bp_systolic: int = Field(..., ge=0, description="Systolic blood pressure (mmHg)")
    bp_diastolic: int = Field(..., ge=0, description="Diastolic blood pressure (mmHg)")
    heart_rate: int = Field(..., ge=0, description="Heart rate (bpm)")
    spo2: int = Field(..., ge=0, le=100, description="Blood oxygen saturation (%)")
    glucose: int = Field(..., ge=0, description="Blood glucose (mg/dL)")
    medications: str = Field(default="", description="Current medications")
    smoking: bool = Field(default=False, description="Smoking status")
    family_history: str = Field(default="", description="Family medical history")


class PatientDataResponse(BaseModel):
    """Response including stored data and computed BMI."""

    patient_id: str
    bmi: float
    bmi_category: str
    message: str


class RiskPredictionInput(BaseModel):
    """Input for health risk prediction."""

    bp_systolic: int = Field(..., ge=0, description="Systolic BP (mmHg)")
    bp_diastolic: int = Field(..., ge=0, description="Diastolic BP (mmHg)")
    glucose: int = Field(..., ge=0, description="Blood glucose (mg/dL)")
    spo2: int = Field(..., ge=0, le=100, description="SpO2 (%)")


class RiskPredictionResponse(BaseModel):
    """Risk prediction output with severity and explanation."""

    risk_level: str  # LOW / MEDIUM / HIGH
    explanation: str
    confidence: float  # 0-100 percentage
    color_code: str  # green / yellow / red


class LabAnalysisInput(BaseModel):
    """Lab test values for analysis."""

    hb: float = Field(..., description="Hemoglobin (g/dL)")
    wbc: float = Field(..., description="White blood cells (K/µL)")
    platelets: float = Field(..., description="Platelets (K/µL)")
    hba1c: float = Field(..., description="HbA1c (%)")
    creatinine: float = Field(..., description="Creatinine (mg/dL)")
    ldl: float = Field(..., description="LDL cholesterol (mg/dL)")
    alt: float = Field(..., description="ALT (U/L)")


class LabAlert(BaseModel):
    """Single abnormal lab alert."""

    parameter: str
    value: float
    reference_range: str
    status: str  # HIGH / LOW
    message: str


class LabAnalysisResponse(BaseModel):
    """Lab analysis result with abnormal alerts."""

    alerts: list[LabAlert]
    summary: str


class DiseasePredictInput(BaseModel):
    """Input for symptom-based disease prediction."""

    symptoms: list[str] = Field(..., description="List of symptom strings")


class DiseasePrediction(BaseModel):
    """Single disease prediction with probability."""

    disease: str
    probability: float
    recommendation: str  # Monitor / Consult / Emergency


class DiseasePredictResponse(BaseModel):
    """Response with possible diseases and recommendations."""

    possible_diseases: list[DiseasePrediction]
    primary_recommendation: str


class DoctorInfo(BaseModel):
    """Doctor profile for listing."""

    id: str
    name: str
    specialty: str
    available: bool
    rating: float


class ConsultStartInput(BaseModel):
    """Input to start a consultation."""

    patient_id: str
    doctor_id: str


class ConsultStartResponse(BaseModel):
    """Response when starting a consultation."""

    consultation_id: str
    doctor_name: str
    message: str


# =============================================================================
# DATABASE SETUP
# =============================================================================

DB_PATH = "healthcare.db"


def init_db():
    """Create SQLite database and patient_data table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS patient_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            height_cm REAL,
            weight_kg REAL,
            bmi REAL,
            bp_systolic INTEGER,
            bp_diastolic INTEGER,
            heart_rate INTEGER,
            spo2 INTEGER,
            glucose INTEGER,
            medications TEXT,
            smoking INTEGER,
            family_history TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def save_patient_data(data: dict, bmi: float):
    """Insert patient record into SQLite."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO patient_data (
            patient_id, age, gender, height_cm, weight_kg, bmi,
            bp_systolic, bp_diastolic, heart_rate, spo2, glucose,
            medications, smoking, family_history
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["patient_id"], data["age"], data["gender"], data["height_cm"],
        data["weight_kg"], bmi, data["bp_systolic"], data["bp_diastolic"],
        data["heart_rate"], data["spo2"], data["glucose"], data["medications"],
        1 if data["smoking"] else 0, data["family_history"]
    ))
    conn.commit()
    conn.close()


# =============================================================================
# RULE-BASED AI LOGIC
# =============================================================================

def get_bmi_category(bmi: float) -> str:
    """Classify BMI into standard categories."""
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"


def predict_risk(bp_systolic: int, bp_diastolic: int, glucose: int, spo2: int) -> RiskPredictionResponse:
    """
    Rule-based health risk prediction.
    - High BP → Cardiac risk
    - High glucose → Diabetes risk
    - Low SpO2 → Respiratory risk
    """
    risks = []
    scores = []

    # Cardiac risk (high BP)
    if bp_systolic >= 180 or bp_diastolic >= 120:
        risks.append("Severe hypertension - high cardiac risk")
        scores.append(90)
    elif bp_systolic >= 140 or bp_diastolic >= 90:
        risks.append("Elevated blood pressure - moderate cardiac risk")
        scores.append(70)
    elif bp_systolic >= 120 or bp_diastolic >= 80:
        risks.append("Borderline blood pressure - watch for cardiac risk")
        scores.append(40)

    # Diabetes risk (high glucose)
    if glucose >= 200:
        risks.append("Very high glucose - high diabetes risk")
        scores.append(90)
    elif glucose >= 126:
        risks.append("Elevated glucose - moderate diabetes risk")
        scores.append(70)
    elif glucose >= 100:
        risks.append("Slightly elevated glucose - low diabetes risk")
        scores.append(40)

    # Respiratory risk (low SpO2)
    if spo2 < 90:
        risks.append("Low oxygen saturation - high respiratory risk")
        scores.append(90)
    elif spo2 < 95:
        risks.append("Borderline oxygen - moderate respiratory risk")
        scores.append(60)
    elif spo2 < 97:
        risks.append("Slightly low oxygen - mild respiratory risk")
        scores.append(35)

    # Determine overall risk level
    if not risks:
        return RiskPredictionResponse(
            risk_level="LOW",
            explanation="Vital signs appear within normal ranges. No significant risk indicators detected.",
            confidence=85.0,
            color_code="green"
        )

    max_score = max(scores)
    avg_score = sum(scores) / len(scores)

    if max_score >= 80 or avg_score >= 70:
        level, color = "HIGH", "red"
    elif max_score >= 50 or avg_score >= 45:
        level, color = "MEDIUM", "yellow"
    else:
        level, color = "LOW", "green"

    explanation = " | ".join(risks)
    confidence = min(95, max(60, max_score + 5))

    return RiskPredictionResponse(
        risk_level=level,
        explanation=explanation,
        confidence=round(confidence, 1),
        color_code=color
    )


# Lab reference ranges (simplified, typical adult values)
LAB_REFERENCE = {
    "hb": (12.0, 17.0),      # g/dL (male)
    "wbc": (4.0, 11.0),      # K/µL
    "platelets": (150, 400), # K/µL
    "hba1c": (4.0, 5.6),     # %
    "creatinine": (0.7, 1.3),# mg/dL
    "ldl": (0, 100),         # mg/dL (optimal <100)
    "alt": (7, 56),          # U/L
}


def analyze_labs(hb: float, wbc: float, platelets: float, hba1c: float,
                 creatinine: float, ldl: float, alt: float) -> LabAnalysisResponse:
    """Check lab values against reference ranges and return abnormal alerts."""
    alerts = []

    checks = [
        ("hb", hb, LAB_REFERENCE["hb"], " Hemoglobin"),
        ("wbc", wbc, LAB_REFERENCE["wbc"], " White blood cells"),
        ("platelets", platelets, LAB_REFERENCE["platelets"], " Platelets"),
        ("hba1c", hba1c, LAB_REFERENCE["hba1c"], " HbA1c"),
        ("creatinine", creatinine, LAB_REFERENCE["creatinine"], " Creatinine"),
        ("ldl", ldl, LAB_REFERENCE["ldl"], " LDL cholesterol"),
        ("alt", alt, LAB_REFERENCE["alt"], " ALT"),
    ]

    for param, value, (low, high), name in checks:
        ref_str = f"{low}-{high}"
        if value < low:
            alerts.append(LabAlert(
                parameter=name.strip(),
                value=value,
                reference_range=ref_str,
                status="LOW",
                message=f"{name} is below normal ({value} vs {ref_str})"
            ))
        elif value > high:
            alerts.append(LabAlert(
                parameter=name.strip(),
                value=value,
                reference_range=ref_str,
                status="HIGH",
                message=f"{name} is above normal ({value} vs {ref_str})"
            ))

    if not alerts:
        summary = "All lab values are within normal reference ranges."
    else:
        summary = f"Found {len(alerts)} abnormal value(s). Please consult a healthcare provider."

    return LabAnalysisResponse(alerts=alerts, summary=summary)


# Symptom → Disease mapping (rule-based, simplified for hackathon)
SYMPTOM_DISEASE_MAP = {
    "fever": [("Influenza", 75, "Consult"), ("COVID-19", 70, "Consult"), ("Common Cold", 65, "Monitor")],
    "cough": [("Bronchitis", 70, "Consult"), ("Asthma", 60, "Consult"), ("Common Cold", 65, "Monitor")],
    "headache": [("Migraine", 65, "Monitor"), ("Tension Headache", 70, "Monitor"), ("Hypertension", 55, "Consult")],
    "fatigue": [("Anemia", 60, "Consult"), ("Thyroid Issue", 55, "Consult"), ("Sleep Disorder", 50, "Monitor")],
    "chest pain": [("Cardiac Issue", 85, "Emergency"), ("Angina", 75, "Emergency"), ("Acid Reflux", 50, "Consult")],
    "shortness of breath": [("Asthma", 75, "Consult"), ("COPD", 70, "Emergency"), ("Anxiety", 55, "Monitor")],
    "nausea": [("Gastritis", 65, "Monitor"), ("Food Poisoning", 70, "Consult"), ("Migraine", 55, "Monitor")],
    "vomiting": [("Gastroenteritis", 75, "Consult"), ("Food Poisoning", 70, "Consult"), ("Migraine", 55, "Monitor")],
    "joint pain": [("Arthritis", 70, "Consult"), ("Rheumatoid Arthritis", 65, "Consult"), ("Strain", 60, "Monitor")],
    "dizziness": [("Vertigo", 70, "Consult"), ("Low BP", 65, "Monitor"), ("Dehydration", 60, "Monitor")],
    "sore throat": [("Pharyngitis", 75, "Monitor"), ("Strep Throat", 70, "Consult"), ("Common Cold", 65, "Monitor")],
    "runny nose": [("Common Cold", 75, "Monitor"), ("Allergy", 70, "Monitor"), ("Influenza", 60, "Consult")],
    "back pain": [("Muscle Strain", 65, "Monitor"), ("Disc Issue", 60, "Consult"), ("Kidney Stone", 55, "Emergency")],
    "abdominal pain": [("Gastritis", 60, "Monitor"), ("Appendicitis", 70, "Emergency"), ("IBS", 55, "Consult")],
    "weight loss": [("Thyroid", 60, "Consult"), ("Diabetes", 55, "Consult"), ("Malabsorption", 50, "Consult")],
    "high fever": [("Infection", 80, "Emergency"), ("COVID-19", 75, "Emergency"), ("Sepsis", 70, "Emergency")],
}


def predict_disease(symptoms: list[str]) -> DiseasePredictResponse:
    """Match symptoms to possible diseases using rule-based lookup."""
    disease_scores: dict[str, tuple[float, str]] = {}

    for s in symptoms:
        key = s.lower().strip()
        if key in SYMPTOM_DISEASE_MAP:
            for disease, prob, rec in SYMPTOM_DISEASE_MAP[key]:
                d = disease
                if d not in disease_scores or disease_scores[d][0] < prob:
                    disease_scores[d] = (prob, rec)

    if not disease_scores:
        return DiseasePredictResponse(
            possible_diseases=[
                DiseasePrediction(disease="General Consultation Recommended", probability=50.0, recommendation="Consult")
            ],
            primary_recommendation="Consult"
        )

    # Sort by probability desc
    sorted_diseases = sorted(disease_scores.items(), key=lambda x: -x[1][0])
    possible = [
        DiseasePrediction(disease=d, probability=p, recommendation=r)
        for d, (p, r) in sorted_diseases[:5]
    ]

    recs = [p.recommendation for p in possible]
    primary = "Emergency" if "Emergency" in recs else ("Consult" if "Consult" in recs else "Monitor")

    return DiseasePredictResponse(
        possible_diseases=possible,
        primary_recommendation=primary
    )


# Dummy doctors for consultation
DUMMY_DOCTORS = [
    {"id": "doc1", "name": "Dr. Sarah Mitchell", "specialty": "General Physician", "available": True, "rating": 4.8},
    {"id": "doc2", "name": "Dr. James Chen", "specialty": "Cardiologist", "available": True, "rating": 4.9},
    {"id": "doc3", "name": "Dr. Emily Watson", "specialty": "Pulmonologist", "available": False, "rating": 4.7},
    {"id": "doc4", "name": "Dr. Michael Brown", "specialty": "Endocrinologist", "available": True, "rating": 4.6},
    {"id": "doc5", "name": "Dr. Lisa Patel", "specialty": "Emergency Medicine", "available": True, "rating": 4.9},
]

# =============================================================================
# FASTAPI APP
# =============================================================================


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize DB on startup, cleanup on shutdown."""
    init_db()
    yield
    # Optional: cleanup if needed


app = FastAPI(
    title="Smart Healthcare Platform API",
    description="Rule-based AI healthcare API for hackathon use",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/")
async def root():
    """Health check and API info."""
    return {
        "message": "Smart Healthcare Platform API is running",
        "docs": "/docs",
        "endpoints": [
            "POST /patient/data",
            "POST /predict/risk",
            "POST /lab/analyze",
            "POST /predict/disease",
            "GET /doctors",
            "POST /consult/start",
        ],
    }


# -----------------------------------------------------------------------------
# 1) Patient Data API
# -----------------------------------------------------------------------------

@app.post("/patient/data", response_model=PatientDataResponse)
async def post_patient_data(data: PatientDataInput):
    """
    Store patient data and auto-calculate BMI.
    BMI = weight_kg / (height_m)^2
    """
    height_m = data.height_cm / 100
    bmi = round(data.weight_kg / (height_m ** 2), 2)
    bmi_category = get_bmi_category(bmi)

    save_patient_data(data.model_dump(), bmi)

    return PatientDataResponse(
        patient_id=data.patient_id,
        bmi=bmi,
        bmi_category=bmi_category,
        message=f"Patient data saved. BMI: {bmi} ({bmi_category})",
    )


# -----------------------------------------------------------------------------
# 2) Health Risk Prediction API
# -----------------------------------------------------------------------------

@app.post("/predict/risk", response_model=RiskPredictionResponse)
async def predict_health_risk(data: RiskPredictionInput):
    """
    Predict health risk based on BP, glucose, and SpO2.
    Returns risk level, explanation, confidence, and color code.
    """
    return predict_risk(
        data.bp_systolic,
        data.bp_diastolic,
        data.glucose,
        data.spo2,
    )


# -----------------------------------------------------------------------------
# 3) Lab Analysis API
# -----------------------------------------------------------------------------

@app.post("/lab/analyze", response_model=LabAnalysisResponse)
async def analyze_lab_data(data: LabAnalysisInput):
    """
    Analyze lab values against reference ranges.
    Returns list of abnormal alerts.
    """
    return analyze_labs(
        data.hb, data.wbc, data.platelets,
        data.hba1c, data.creatinine, data.ldl, data.alt,
    )


# -----------------------------------------------------------------------------
# 4) Disease Predictor (Symptoms-based)
# -----------------------------------------------------------------------------

@app.post("/predict/disease", response_model=DiseasePredictResponse)
async def predict_disease_from_symptoms(data: DiseasePredictInput):
    """
    Predict possible diseases from symptom list.
    Returns diseases, probability %, and recommendation.
    """
    return predict_disease(data.symptoms)


# -----------------------------------------------------------------------------
# 5) Doctor Consultation (Mock)
# -----------------------------------------------------------------------------

@app.get("/doctors", response_model=list[DoctorInfo])
async def get_doctors():
    """Return list of dummy doctors for consultation."""
    return [DoctorInfo(**d) for d in DUMMY_DOCTORS]


@app.post("/consult/start", response_model=ConsultStartResponse)
async def start_consultation(data: ConsultStartInput):
    """Start a mock consultation with a doctor."""
    doctor = next((d for d in DUMMY_DOCTORS if d["id"] == data.doctor_id), None)
    if not doctor:
        return ConsultStartResponse(
            consultation_id="",
            doctor_name="",
            message="Doctor not found.",
        )
    consult_id = f"consult_{data.patient_id}_{data.doctor_id}_001"
    return ConsultStartResponse(
        consultation_id=consult_id,
        doctor_name=doctor["name"],
        message=f"Connecting to {doctor['name']} via 5G... Consultation started. ID: {consult_id}",
    )
