import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Brain, X } from "lucide-react";
import { useState } from "react";

interface DiseasePredictorProps {
  onPredict: (symptoms: string[]) => void;
  predictions: Array<{ disease: string; probability: number }>;
}

export function DiseasePredictor({ onPredict, predictions }: DiseasePredictorProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const availableSymptoms = [
    "Fever",
    "Cough",
    "Fatigue",
    "Chest Pain",
    "Shortness of Breath",
    "Headache",
    "Nausea",
    "Dizziness",
    "Joint Pain",
    "Sore Throat",
    "Muscle Ache",
    "Loss of Appetite",
  ];

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handlePredict = () => {
    if (selectedSymptoms.length > 0) {
      onPredict(selectedSymptoms);
    }
  };

  return (
    <Card className="p-6 shadow-md rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="text-gray-900">Disease Predictor by Symptoms</h3>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">Select symptoms:</p>
        <div className="flex flex-wrap gap-2">
          {availableSymptoms.map((symptom) => (
            <Badge
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`cursor-pointer transition-colors ${
                selectedSymptoms.includes(symptom)
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {symptom}
              {selectedSymptoms.includes(symptom) && (
                <X className="w-3 h-3 ml-1 inline" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {selectedSymptoms.length > 0 && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-1">Selected symptoms:</p>
          <p className="text-sm text-gray-600">{selectedSymptoms.join(", ")}</p>
        </div>
      )}

      <Button
        onClick={handlePredict}
        disabled={selectedSymptoms.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
      >
        <Brain className="w-4 h-4 mr-2" />
        Predict Disease
      </Button>

      {predictions.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Possible conditions:</p>
          {predictions.map((pred, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white border border-purple-200 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-900">{pred.disease}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${pred.probability}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-12 text-right">
                  {pred.probability}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
