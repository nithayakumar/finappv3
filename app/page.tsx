'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Questionnaire from '@/components/Questionnaire';
import { createModel } from '@/lib/modelService';

export default function Home() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleQuestionnaireComplete = async (data: {
    annualSalary: number;
    age: number;
    targetRetirementAge: number;
  }) => {
    try {
      setCreating(true);
      const model = await createModel(data);
      router.push(`/model/${model.id}`);
    } catch (error) {
      console.error('Failed to create model:', error);
      alert('Failed to create model. Please try again.');
      setCreating(false);
    }
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
          ) : creating ? (
            <div className="bg-white border-2 border-black p-8 text-center">
              <p className="text-xl text-black">Creating your financial model...</p>
            </div>
          ) : (
            <Questionnaire onComplete={handleQuestionnaireComplete} />
          )}
        </main>
      </div>
    </div>
  );
}
