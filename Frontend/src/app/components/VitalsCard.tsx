import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Heart, Activity, Droplets, Thermometer } from "lucide-react";

interface VitalsCardProps {
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  heartRate: string;
  spo2: string;
  glucose: string;
  onBloodPressureSystolicChange: (value: string) => void;
  onBloodPressureDiastolicChange: (value: string) => void;
  onHeartRateChange: (value: string) => void;
  onSpo2Change: (value: string) => void;
  onGlucoseChange: (value: string) => void;
}

export function VitalsCard({
  bloodPressureSystolic,
  bloodPressureDiastolic,
  heartRate,
  spo2,
  glucose,
  onBloodPressureSystolicChange,
  onBloodPressureDiastolicChange,
  onHeartRateChange,
  onSpo2Change,
  onGlucoseChange,
}: VitalsCardProps) {
  return (
    <Card className="p-6 shadow-md rounded-xl">
      <h3 className="mb-4 text-gray-900">Vitals</h3>
      <div className="space-y-4">
        <div>
          <Label className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Blood Pressure (mmHg)
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="number"
              value={bloodPressureSystolic}
              onChange={(e) => onBloodPressureSystolicChange(e.target.value)}
              placeholder="120"
            />
            <span className="flex items-center text-gray-500">/</span>
            <Input
              type="number"
              value={bloodPressureDiastolic}
              onChange={(e) => onBloodPressureDiastolicChange(e.target.value)}
              placeholder="80"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="heartRate" className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-600" />
            Heart Rate (bpm)
          </Label>
          <Input
            id="heartRate"
            type="number"
            value={heartRate}
            onChange={(e) => onHeartRateChange(e.target.value)}
            placeholder="72"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="spo2" className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            SpO₂ (%)
          </Label>
          <Input
            id="spo2"
            type="number"
            value={spo2}
            onChange={(e) => onSpo2Change(e.target.value)}
            placeholder="98"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="glucose" className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-600" />
            Glucose (mg/dL)
          </Label>
          <Input
            id="glucose"
            type="number"
            value={glucose}
            onChange={(e) => onGlucoseChange(e.target.value)}
            placeholder="95"
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
}
