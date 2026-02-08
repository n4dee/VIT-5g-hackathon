import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";

interface LifestyleCardProps {
  medications: string;
  smoking: string;
  familyHistory: string;
  onMedicationsChange: (value: string) => void;
  onSmokingChange: (value: string) => void;
  onFamilyHistoryChange: (value: string) => void;
}

export function LifestyleCard({
  medications,
  smoking,
  familyHistory,
  onMedicationsChange,
  onSmokingChange,
  onFamilyHistoryChange,
}: LifestyleCardProps) {
  return (
    <Card className="p-6 shadow-md rounded-xl">
      <h3 className="mb-4 text-gray-900">Lifestyle & History</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="medications">Medications</Label>
          <Input
            id="medications"
            value={medications}
            onChange={(e) => onMedicationsChange(e.target.value)}
            placeholder="e.g., Metformin, Aspirin"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Smoking</Label>
          <RadioGroup value={smoking} onValueChange={onSmokingChange} className="flex gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="smoking-no" />
              <Label htmlFor="smoking-no" className="cursor-pointer">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="smoking-yes" />
              <Label htmlFor="smoking-yes" className="cursor-pointer">Yes</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="familyHistory">Family History</Label>
          <Textarea
            id="familyHistory"
            value={familyHistory}
            onChange={(e) => onFamilyHistoryChange(e.target.value)}
            placeholder="e.g., Diabetes (Father), Hypertension (Mother)"
            className="mt-1 min-h-20"
          />
        </div>
      </div>
    </Card>
  );
}
