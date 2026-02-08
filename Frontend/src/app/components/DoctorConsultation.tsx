import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Video, Signal } from "lucide-react";
import { Badge } from "./ui/badge";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  status: "available" | "busy";
  image: string;
}

export function DoctorConsultation() {
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      specialization: "Cardiologist",
      status: "available",
      image: "https://images.unsplash.com/photo-1576669801945-7a346954da5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBwcm9mZXNzaW9uYWwlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc3MDM5Mzc4MXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      name: "Dr. James Chen",
      specialization: "Endocrinologist",
      status: "available",
      image: "https://images.unsplash.com/photo-1659353885824-1199aeeebfc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZG9jdG9yJTIwY2FyZGlvbG9naXN0JTIwbWVkaWNhbHxlbnwxfHx8fDE3NzA0ODE2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      name: "Dr. Maria Rodriguez",
      specialization: "General Physician",
      status: "busy",
      image: "https://images.unsplash.com/photo-1758691463626-0ab959babe00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkb2N0b3IlMjBtZWRpY2FsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwNDgxNDg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <Card className="p-6 shadow-md rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Video className="w-5 h-5 text-blue-600" />
        <h3 className="text-gray-900">1-to-1 Live Doctor Session</h3>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Signal className="w-4 h-4 text-teal-500" />
        <span className="text-xs text-gray-600">Powered by 5G – Low latency video call</span>
      </div>

      <div className="space-y-3">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{doctor.name}</h4>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                className={
                  doctor.status === "available"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-300"
                }
              >
                {doctor.status === "available" ? "Available" : "Busy"}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
        <Video className="w-4 h-4 mr-2" />
        Start 1-on-1 Consultation
      </Button>
    </Card>
  );
}
