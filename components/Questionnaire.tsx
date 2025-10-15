'use client';

import { useState } from 'react';

interface QuestionnaireProps {
  onComplete: (data: {
    annualSalary: number;
    age: number;
    targetRetirementAge: number;
    salaryGrowthRate: number;
  }) => void;
}

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [annualSalary, setAnnualSalary] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [targetRetirementAge, setTargetRetirementAge] = useState<string>('');
  const [salaryGrowthRate, setSalaryGrowthRate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onComplete({
        annualSalary: parseFloat(annualSalary),
        age: parseInt(age),
        targetRetirementAge: parseInt(targetRetirementAge),
        salaryGrowthRate: parseFloat(salaryGrowthRate),
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
      parseInt(targetRetirementAge) < 150 &&
      salaryGrowthRate &&
      parseFloat(salaryGrowthRate) >= 0
    );
  };

  const workingYears =
    age && targetRetirementAge && parseInt(targetRetirementAge) > parseInt(age)
      ? parseInt(targetRetirementAge) - parseInt(age)
      : 0;

  // Calculate monthly growth rate
  const monthlyGrowthRate = salaryGrowthRate
    ? (Math.pow(1 + parseFloat(salaryGrowthRate) / 100, 1/12) - 1) * 100
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border-2 border-black p-6">
        <h2 className="text-xl font-bold text-black mb-4">Financial Planning</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Annual Salary */}
          <div className="flex items-center gap-4">
            <label htmlFor="salary" className="text-base font-bold text-black w-64 flex-shrink-0">
              Annual Salary
            </label>
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-black">$</span>
              <input
                id="salary"
                type="number"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(e.target.value)}
                placeholder="120000"
                className="w-full text-base text-black pl-8 pr-3 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>

          {/* Age */}
          <div className="flex items-center gap-4">
            <label htmlFor="age" className="text-base font-bold text-black w-64 flex-shrink-0">
              Current Age
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
              className="flex-grow text-base text-black px-3 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Target Retirement Age */}
          <div className="flex items-center gap-4">
            <label htmlFor="retirement" className="text-base font-bold text-black w-64 flex-shrink-0">
              Target Retirement Age
            </label>
            <input
              id="retirement"
              type="number"
              value={targetRetirementAge}
              onChange={(e) => setTargetRetirementAge(e.target.value)}
              placeholder="65"
              className="flex-grow text-base text-black px-3 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {workingYears > 0 && (
              <span className="text-sm text-black whitespace-nowrap">
                ({workingYears} years)
              </span>
            )}
          </div>

          {/* Annual Salary Growth Rate */}
          <div className="flex items-center gap-4">
            <label htmlFor="growth" className="text-base font-bold text-black w-64 flex-shrink-0">
              Annual Salary Growth
            </label>
            <div className="relative flex-grow">
              <input
                id="growth"
                type="number"
                step="0.1"
                value={salaryGrowthRate}
                onChange={(e) => setSalaryGrowthRate(e.target.value)}
                placeholder="5.0"
                className="w-full text-base text-black px-3 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-black">%</span>
            </div>
            {salaryGrowthRate && parseFloat(salaryGrowthRate) >= 0 && (
              <span className="text-sm text-black whitespace-nowrap">
                (~{monthlyGrowthRate.toFixed(2)}% monthly)
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full px-6 py-3 bg-black text-white text-base font-medium hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Create Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
