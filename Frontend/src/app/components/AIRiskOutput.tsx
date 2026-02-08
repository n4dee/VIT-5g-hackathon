import { Card } from "./ui/card";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";

interface RiskPrediction {
  condition: string;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  explanation: string;
}

interface AIRiskOutputProps {
  predictions: RiskPrediction[];
}

export function AIRiskOutput({ predictions }: AIRiskOutputProps) {
  if (predictions.length === 0) {
    return null;
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "high":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">🟢 Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">🟡 Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">🔴 High Risk</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 shadow-md rounded-xl border-blue-200 bg-gradient-to-br from-blue-50 to-teal-50">
      <h3 className="mb-4 text-gray-900">AI Health Risk Prediction</h3>
      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getRiskIcon(prediction.riskLevel)}
                <h4 className="font-medium text-gray-900">{prediction.condition}</h4>
              </div>
              {getRiskBadge(prediction.riskLevel)}
            </div>
            <p className="text-sm text-gray-600 mb-3">{prediction.explanation}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    prediction.riskLevel === "high"
                      ? "bg-red-500"
                      : prediction.riskLevel === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${prediction.confidence}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {prediction.confidence}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
