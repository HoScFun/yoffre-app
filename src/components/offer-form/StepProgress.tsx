"use client";

import { Progress } from "@/components/ui/progress";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ["Profil", "Informations", "Clauses", "Vérification"];

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {stepLabels.map((label, i) => (
          <span
            key={i}
            className={`text-xs font-medium ${
              i + 1 <= currentStep ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
