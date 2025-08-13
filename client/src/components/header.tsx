import { Calendar } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-brand-background border-b border-brand-secondary py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="text-brand-primary text-2xl h-8 w-8" />
            <h1 className="text-xl font-semibold text-gray-800">
              Sistema de Agendamento
            </h1>
          </div>
          <div className="text-sm text-gray-500">MVP v1.0</div>
        </div>
      </div>
    </header>
  );
}
