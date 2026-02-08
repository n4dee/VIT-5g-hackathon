import { Activity, User } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">SmartFit</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-blue-600 font-medium hover:text-blue-700">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Predict Risks
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Doctors
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Disease Predictor
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Reports
            </a>
          </nav>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
