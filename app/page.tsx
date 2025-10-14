'use client';

import { useState } from 'react';
import Questionnaire from '@/components/Questionnaire';

export default function Home() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleQuestionnaireComplete = (data: {
    annualSalary: number;
    age: number;
    targetRetirementAge: number;
  }) => {
    console.log('Questionnaire data:', data);
    // TODO: Create model and redirect to results page
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-black">FinAppV3</h1>
          <p className="text-gray-600 mt-2">Financial Planning & Modeling</p>
        </header>

        <main>
          {!showQuestionnaire ? (
            <div className="bg-white border-2 border-black p-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Get Started</h2>
              <p className="text-gray-700 mb-6">
                Create your financial model by answering a few questions about your income
                and retirement goals.
              </p>

              <button
                onClick={() => setShowQuestionnaire(true)}
                className="bg-black text-white px-6 py-2 font-medium hover:bg-gray-800 transition-colors"
              >
                Start Questionnaire
              </button>
            </div>
          ) : (
            <Questionnaire onComplete={handleQuestionnaireComplete} />
          )}
        </main>
      </div>
    </div>
  );
}
