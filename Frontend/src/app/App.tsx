import { useState } from "react";
import { Header } from "./components/Header";
import { PatientInfoCard } from "./components/PatientInfoCard";
import { VitalsCard } from "./components/VitalsCard";
import { LifestyleCard } from "./components/LifestyleCard";
import { LabResultsPanel } from "./components/LabResultsPanel";
import { AIRiskOutput } from "./components/AIRiskOutput";
import { DoctorConsultation } from "./components/DoctorConsultation";
import { DiseasePredictor } from "./components/DiseasePredictor";
import { Button } from "./components/ui/button";
import { Sparkles } from "lucide-react";
import { Toaster, toast } from "sonner";

interface RiskPrediction {
  condition: string;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  explanation: string;
}

export default function App() {
  // Patient Information State
  const [patientId, setPatientId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("M");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");

  // Vitals State
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState("");
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [spo2, setSpo2] = useState("");
  const [glucose, setGlucose] = useState("");

  // Lifestyle State
  const [medications, setMedications] = useState("");
  const [smoking, setSmoking] = useState("No");
  const [familyHistory, setFamilyHistory] = useState("");

  // Lab Results State
  const [hb, setHb] = useState("");
  const [wbc, setWbc] = useState("");
  const [platelets, setPlatelets] = useState("");
  const [glucoseLab, setGlucoseLab] = useState("");
  const [hba1c, setHba1c] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [ldl, setLdl] = useState("");
  const [alt, setAlt] = useState("");

  // Predictions State
  const [riskPredictions, setRiskPredictions] = useState<RiskPrediction[]>([]);
  const [diseasePredictions, setDiseasePredictions] = useState<
    Array<{ disease: string; probability: number }>
  >([]);

  const handlePredictHealthRisks = () => {
    // Mock AI prediction based on inputs
    const predictions: RiskPrediction[] = [];

    // Diabetes risk based on glucose and HbA1c
    const glucoseVal = parseFloat(glucose) || parseFloat(glucoseLab) || 0;
    const hba1cVal = parseFloat(hba1c) || 0;
    if (glucoseVal > 0 || hba1cVal > 0) {
      if (glucoseVal > 125 || hba1cVal > 6.5) {
        predictions.push({
          condition: "Type 2 Diabetes",
          riskLevel: "high",
          confidence: 85,
          explanation:
            "Elevated glucose levels and HbA1c indicate high risk for diabetes. Immediate consultation recommended.",
        });
      } else if (glucoseVal > 100 || hba1cVal > 5.7) {
        predictions.push({
          condition: "Pre-Diabetes",
          riskLevel: "medium",
          confidence: 72,
          explanation:
            "Glucose levels are in pre-diabetic range. Lifestyle modifications recommended.",
        });
      } else {
        predictions.push({
          condition: "Type 2 Diabetes",
          riskLevel: "low",
          confidence: 92,
          explanation: "Glucose and HbA1c levels are within normal range.",
        });
      }
    }

    // Cardiac risk based on BP and cholesterol
    const systolic = parseFloat(bloodPressureSystolic) || 0;
    const ldlVal = parseFloat(ldl) || 0;
    if (systolic > 0 || ldlVal > 0) {
      if (systolic > 140 || ldlVal > 160) {
        predictions.push({
          condition: "Cardiovascular Disease",
          riskLevel: "high",
          confidence: 78,
          explanation:
            "High blood pressure and elevated LDL cholesterol increase cardiac risk significantly.",
        });
      } else if (systolic > 130 || ldlVal > 130) {
        predictions.push({
          condition: "Hypertension",
          riskLevel: "medium",
          confidence: 65,
          explanation:
            "Blood pressure is slightly elevated. Monitor regularly and consider lifestyle changes.",
        });
      } else {
        predictions.push({
          condition: "Cardiovascular Disease",
          riskLevel: "low",
          confidence: 88,
          explanation: "Blood pressure and cholesterol levels are healthy.",
        });
      }
    }

    // BMI-based risk
    const bmiVal = parseFloat(bmi) || 0;
    if (bmiVal > 0) {
      if (bmiVal > 30) {
        predictions.push({
          condition: "Obesity-related Complications",
          riskLevel: "high",
          confidence: 80,
          explanation:
            "BMI indicates obesity, which increases risk for multiple health conditions.",
        });
      } else if (bmiVal > 25) {
        predictions.push({
          condition: "Metabolic Syndrome",
          riskLevel: "medium",
          confidence: 68,
          explanation: "BMI indicates overweight status. Weight management recommended.",
        });
      }
    }

    if (predictions.length === 0) {
      toast.error("Please fill in health data to get predictions");
      return;
    }

    setRiskPredictions(predictions);
    toast.success("AI analysis complete!");

    // Scroll to predictions
    setTimeout(() => {
      document.getElementById("predictions")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDiseasePredict = (symptoms: string[]) => {
    // Mock disease prediction based on symptoms
    const diseases: Array<{ disease: string; probability: number }> = [];

    const symptomSet = new Set(symptoms.map((s) => s.toLowerCase()));

    if (symptomSet.has("fever") && symptomSet.has("cough")) {
      diseases.push({ disease: "Influenza (Flu)", probability: 75 });
      diseases.push({ disease: "COVID-19", probability: 65 });
    }

    if (symptomSet.has("chest pain") && symptomSet.has("shortness of breath")) {
      diseases.push({ disease: "Acute Coronary Syndrome", probability: 70 });
      diseases.push({ disease: "Pneumonia", probability: 60 });
    }

    if (symptomSet.has("headache") && symptomSet.has("fever")) {
      diseases.push({ disease: "Viral Infection", probability: 68 });
      diseases.push({ disease: "Meningitis", probability: 45 });
    }

    if (symptomSet.has("fatigue") && symptomSet.has("joint pain")) {
      diseases.push({ disease: "Chronic Fatigue Syndrome", probability: 55 });
      diseases.push({ disease: "Fibromyalgia", probability: 50 });
    }

    if (diseases.length === 0) {
      diseases.push({ disease: "Common Cold", probability: 65 });
      diseases.push({ disease: "Viral Infection", probability: 55 });
      diseases.push({ disease: "Stress-related Symptoms", probability: 45 });
    }

    // Sort by probability
    diseases.sort((a, b) => b.probability - a.probability);

    setDiseasePredictions(diseases.slice(0, 5));
    toast.success("Disease prediction complete!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Forms */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-gray-900 mb-2">Patient Health Dashboard</h1>
              <p className="text-gray-600">
                Enter patient health data for AI-powered risk assessment
              </p>
            </div>

            <PatientInfoCard
              patientId={patientId}
              age={age}
              gender={gender}
              height={height}
              weight={weight}
              bmi={bmi}
              onPatientIdChange={setPatientId}
              onAgeChange={setAge}
              onGenderChange={setGender}
              onHeightChange={setHeight}
              onWeightChange={setWeight}
              onBmiChange={setBmi}
            />

            <VitalsCard
              bloodPressureSystolic={bloodPressureSystolic}
              bloodPressureDiastolic={bloodPressureDiastolic}
              heartRate={heartRate}
              spo2={spo2}
              glucose={glucose}
              onBloodPressureSystolicChange={setBloodPressureSystolic}
              onBloodPressureDiastolicChange={setBloodPressureDiastolic}
              onHeartRateChange={setHeartRate}
              onSpo2Change={setSpo2}
              onGlucoseChange={setGlucose}
            />

            <LifestyleCard
              medications={medications}
              smoking={smoking}
              familyHistory={familyHistory}
              onMedicationsChange={setMedications}
              onSmokingChange={setSmoking}
              onFamilyHistoryChange={setFamilyHistory}
            />

            {/* Predict Health Risks Button */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-xl shadow-lg">
              <Button
                onClick={handlePredictHealthRisks}
                className="w-full h-14 bg-white text-blue-700 hover:bg-gray-50 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                PREDICT HEALTH RISKS
              </Button>
              <p className="text-center text-white text-sm mt-3">
                AI-based risk prediction using real-time health data
              </p>
            </div>

            {/* AI Predictions Output */}
            <div id="predictions">
              <AIRiskOutput predictions={riskPredictions} />
            </div>

            {/* Disease Predictor */}
            <DiseasePredictor
              onPredict={handleDiseasePredict}
              predictions={diseasePredictions}
            />
          </div>

          {/* Right Column - Lab Results & Doctor Consultation */}
          <div className="space-y-6">
            <LabResultsPanel
              hb={hb}
              wbc={wbc}
              platelets={platelets}
              glucoseLab={glucoseLab}
              hba1c={hba1c}
              creatinine={creatinine}
              ldl={ldl}
              alt={alt}
              onHbChange={setHb}
              onWbcChange={setWbc}
              onPlateletsChange={setPlatelets}
              onGlucoseLabChange={setGlucoseLab}
              onHba1cChange={setHba1c}
              onCreatinineChange={setCreatinine}
              onLdlChange={setLdl}
              onAltChange={setAlt}
            />

            <DoctorConsultation />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-semibold">Disclaimer:</span> AI predictions are advisory only
            and should not replace professional medical advice. Always consult with qualified
            healthcare providers.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900">
              Contact
            </a>
            <a href="#" className="hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
