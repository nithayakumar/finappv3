'use client';

import { useState } from 'react';

interface QuestionnaireProps {
  onComplete: (data: { annualSalary: number; age: number; targetRetirementAge: number }) => void;
}

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [step, setStep] = useState(1);
  const [annualSalary, setAnnualSalary] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [targetRetirementAge, setTargetRetirementAge] = useState<string>('');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final step - submit
      onComplete({
        annualSalary: parseFloat(annualSalary),
        age: parseInt(age),
        targetRetirementAge: parseInt(targetRetirementAge),
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return annualSalary && parseFloat(annualSalary) > 0;
      case 2:
        return age && parseInt(age) > 0 && parseInt(age) < 150;
      case 3:
        return (
          targetRetirementAge &&
          parseInt(targetRetirementAge) > parseInt(age) &&
          parseInt(targetRetirementAge) < 150
        );
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border-2 border-black p-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-black">Question {step} of 3</span>
            <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 border border-black">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Question content */}
        <div className="mb-8">
          {step === 1 && (
            <div>
              <label className="block text-2xl font-bold text-black mb-4">
                What is your annual salary?
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-black">
                  $
                </span>
                <input
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(e.target.value)}
                  placeholder="120000"
                  className="w-full text-2xl pl-10 pr-4 py-4 border-2 border-black focus:outline-none focus:ring-4 focus:ring-gray-300"
                  autoFocus
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">Enter your current annual income</p>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-2xl font-bold text-black mb-4">
                What is your current age?
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="30"
                className="w-full text-2xl px-4 py-4 border-2 border-black focus:outline-none focus:ring-4 focus:ring-gray-300"
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-600">Your age in years</p>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-2xl font-bold text-black mb-4">
                What is your target retirement age?
              </label>
              <input
                type="number"
                value={targetRetirementAge}
                onChange={(e) => setTargetRetirementAge(e.target.value)}
                placeholder="65"
                className="w-full text-2xl px-4 py-4 border-2 border-black focus:outline-none focus:ring-4 focus:ring-gray-300"
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-600">When do you plan to retire?</p>
              {age && targetRetirementAge && parseInt(targetRetirementAge) > parseInt(age) && (
                <p className="mt-4 text-sm font-medium text-black">
                  Working years: {parseInt(targetRetirementAge) - parseInt(age)} years
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-3 border-2 border-black text-black font-medium hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {step === 3 ? 'Create Model' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
