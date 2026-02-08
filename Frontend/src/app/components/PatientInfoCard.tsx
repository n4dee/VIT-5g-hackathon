import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useEffect } from "react";

interface PatientInfoCardProps {
  patientId: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  bmi: string;
  onPatientIdChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onBmiChange: (value: string) => void;
}

export function PatientInfoCard({
  patientId,
  age,
  gender,
  height,
  weight,
  bmi,
  onPatientIdChange,
  onAgeChange,
  onGenderChange,
  onHeightChange,
  onWeightChange,
  onBmiChange,
}: PatientInfoCardProps) {
  // Auto-calculate BMI
  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const calculatedBmi = (w / (heightInMeters * heightInMeters)).toFixed(1);
      onBmiChange(calculatedBmi);
    } else {
      onBmiChange("");
    }
  }, [height, weight, onBmiChange]);

  return (
    <Card className="p-6 shadow-md rounded-xl">
      <h3 className="mb-4 text-gray-900">Patient Information</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientId">Patient ID</Label>
            <Input
              id="patientId"
              value={patientId}
              onChange={(e) => onPatientIdChange(e.target.value)}
              placeholder="P12345"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => onAgeChange(e.target.value)}
              placeholder="35"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>Gender</Label>
          <RadioGroup value={gender} onValueChange={onGenderChange} className="flex gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="M" id="male" />
              <Label htmlFor="male" className="cursor-pointer">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="F" id="female" />
              <Label htmlFor="female" className="cursor-pointer">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => onHeightChange(e.target.value)}
              placeholder="170"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
              placeholder="70"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="bmi">BMI</Label>
            <Input
              id="bmi"
              value={bmi}
              disabled
              placeholder="--"
              className="mt-1 bg-gray-50"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
