import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TestTube } from "lucide-react";

interface LabResultsPanelProps {
  hb: string;
  wbc: string;
  platelets: string;
  glucoseLab: string;
  hba1c: string;
  creatinine: string;
  ldl: string;
  alt: string;
  onHbChange: (value: string) => void;
  onWbcChange: (value: string) => void;
  onPlateletsChange: (value: string) => void;
  onGlucoseLabChange: (value: string) => void;
  onHba1cChange: (value: string) => void;
  onCreatinineChange: (value: string) => void;
  onLdlChange: (value: string) => void;
  onAltChange: (value: string) => void;
}

export function LabResultsPanel({
  hb,
  wbc,
  platelets,
  glucoseLab,
  hba1c,
  creatinine,
  ldl,
  alt,
  onHbChange,
  onWbcChange,
  onPlateletsChange,
  onGlucoseLabChange,
  onHba1cChange,
  onCreatinineChange,
  onLdlChange,
  onAltChange,
}: LabResultsPanelProps) {
  return (
    <Card className="p-6 shadow-md rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <TestTube className="w-5 h-5 text-teal-600" />
        <h3 className="text-gray-900">Lab Results</h3>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 items-center">
          <Label htmlFor="hb" className="text-sm">Hb (g/dL)</Label>
          <Input
            id="hb"
            type="number"
            value={hb}
            onChange={(e) => onHbChange(e.target.value)}
            placeholder="14.5"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 items-center">
          <Label htmlFor="wbc" className="text-sm">WBC (x10³/μL)</Label>
          <Input
            id="wbc"
            type="number"
            value={wbc}
            onChange={(e) => onWbcChange(e.target.value)}
            placeholder="7.5"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 items-center">
          <Label htmlFor="platelets" className="text-sm">Platelets (x10³/μL)</Label>
          <Input
            id="platelets"
            type="number"
            value={platelets}
            onChange={(e) => onPlateletsChange(e.target.value)}
            placeholder="250"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 items-center">
          <Label htmlFor="glucoseLab" className="text-sm">Glucose (mg/dL)</Label>
          <Input
            id="glucoseLab"
            type="number"
            value={glucoseLab}
            onChange={(e) => onGlucoseLabChange(e.target.value)}
            placeholder="95"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 items-center">
          <Label htmlFor="hba1c" className="text-sm">HbA1c (%)</Label>
          <Input
            id="hba1c"
            type="number"
            value={hba1c}
            onChange={(e) => onHba1cChange(e.target.value)}
            placeholder="5.5"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 items-center">
          <Label htmlFor="creatinine" className="text-sm">Creatinine (mg/dL)</Label>
          <Input
            id="creatinine"
            type="number"
            value={creatinine}
            onChange={(e) => onCreatinineChange(e.target.value)}
            placeholder="1.0"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 items-center">
          <Label htmlFor="ldl" className="text-sm">LDL (mg/dL)</Label>
          <Input
            id="ldl"
            type="number"
            value={ldl}
            onChange={(e) => onLdlChange(e.target.value)}
            placeholder="100"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 items-center">
          <Label htmlFor="alt" className="text-sm">ALT (U/L)</Label>
          <Input
            id="alt"
            type="number"
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="25"
            className="h-9"
          />
        </div>
      </div>
    </Card>
  );
}
