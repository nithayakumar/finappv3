'use client';

import { useState } from 'react';

interface QuestionnaireProps {
  onComplete: (data: { annualSalary: number; age: number; targetRetirementAge: number }) => void;
}

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [annualSalary, setAnnualSalary] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [targetRetirementAge, setTargetRetirementAge] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onComplete({
        annualSalary: parseFloat(annualSalary),
        age: parseInt(age),
        targetRetirementAge: parseInt(targetRetirementAge),
      });
    }
  };

  const isFormValid = () => {
    return (
      annualSalary &&
      parseFloat(annualSalary) > 0 &&
      age &&
      parseInt(age) > 0 &&
      parseInt(age) < 150 &&
      targetRetirementAge &&
      parseInt(targetRetirementAge) > parseInt(age) &&
      parseInt(targetRetirementAge) < 150
    );
  };

  const workingYears =
    age && targetRetirementAge && parseInt(targetRetirementAge) > parseInt(age)
      ? parseInt(targetRetirementAge) - parseInt(age)
      : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border-2 border-black p-8">
        <h2 className="text-2xl font-bold text-black mb-8">Financial Planning Questions</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Annual Salary */}
          <div>
            <label htmlFor="salary" className="block text-lg font-bold text-black mb-3">
              What is your annual salary?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-black">
                $
              </span>
              <input
                id="salary"
                type="number"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(e.target.value)}
                placeholder="120000"
                className="w-full text-xl text-black pl-10 pr-4 py-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-gray-300"
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">Enter your current annual income</p>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-lg font-bold text-black mb-3">
              What is your current age?
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
              className="w-full text-xl text-black px-4 py-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-gray-300"
            />
            <p className="mt-2 text-sm text-gray-600">Your age in years</p>
          </div>

          {/* Target Retirement Age */}
          <div>
            <label htmlFor="retirement" className="block text-lg font-bold text-black mb-3">
              What is your target retirement age?
            </label>
            <input
              id="retirement"
              type="number"
              value={targetRetirementAge}
              onChange={(e) => setTargetRetirementAge(e.target.value)}
              placeholder="65"
              className="w-full text-xl text-black px-4 py-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-gray-300"
            />
            <p className="mt-2 text-sm text-gray-600">When do you plan to retire?</p>
            {workingYears > 0 && (
              <p className="mt-3 text-base font-medium text-black">
                Working years: {workingYears} years
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full px-6 py-4 bg-black text-white text-lg font-medium hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Create Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
