'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Questionnaire from '@/components/Questionnaire';
import FinancialTable from '@/components/FinancialTable';
import { createModel, getModel } from '@/lib/modelService';

export default function Home() {
  const searchParams = useSearchParams();
  const [showQuestionnaire, setShowQuestionnaire] = useState(searchParams.get('view') === 'questionnaire');
  const [creating, setCreating] = useState(false);
  const [currentModelId, setCurrentModelId] = useState<string | null>(searchParams.get('model'));
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Preserve questionnaire values
  const [questionnaireData, setQuestionnaireData] = useState<{
    annualSalary: string;
    age: string;
    targetRetirementAge: string;
    salaryGrowthRate: string;
  }>({
    annualSalary: '',
    age: '',
    targetRetirementAge: '',
    salaryGrowthRate: '',
  });

  const router = useRouter();

  const handleQuestionnaireComplete = async (data: {
    annualSalary: number;
    age: number;
    targetRetirementAge: number;
    salaryGrowthRate: number;
  }) => {
    try {
      setCreating(true);
      // Save the data for later
      setQuestionnaireData({
        annualSalary: data.annualSalary.toString(),
        age: data.age.toString(),
        targetRetirementAge: data.targetRetirementAge.toString(),
        salaryGrowthRate: data.salaryGrowthRate.toString(),
      });
      const model = await createModel(data);
      setCurrentModelId(model.id);
      setShowQuestionnaire(false);
      setCreating(false);
      router.push(`/?model=${model.id}`);
    } catch (error) {
      console.error('Failed to create model:', error);
      alert('Failed to create model. Please try again.');
      setCreating(false);
    }
  };

  const handleViewToggle = (view: 'questionnaire' | 'model') => {
    setShowQuestionnaire(view === 'questionnaire');
    if (view === 'questionnaire') {
      router.push('/?view=questionnaire');
    } else if (currentModelId) {
      // Trigger refresh when switching back to model
      setRefreshTrigger(prev => prev + 1);
      router.push(`/?model=${currentModelId}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-black">FinAppV3</h1>
            <p className="text-gray-600 mt-2">Financial Planning & Modeling</p>
          </div>

          {currentModelId && (
            <div className="flex border-2 border-black">
              <button
                onClick={() => handleViewToggle('questionnaire')}
                className={`px-4 py-2 font-medium transition-colors ${
                  showQuestionnaire
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                Questionnaire
              </button>
              <button
                onClick={() => handleViewToggle('model')}
                className={`px-4 py-2 font-medium border-l-2 border-black transition-colors ${
                  !showQuestionnaire
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                Model
              </button>
            </div>
          )}
        </header>

        <main>
          {creating ? (
            <div className="bg-white border-2 border-black p-8 text-center">
              <p className="text-xl text-black">Creating your financial model...</p>
            </div>
          ) : showQuestionnaire || !currentModelId ? (
            <Questionnaire
              onComplete={handleQuestionnaireComplete}
              initialValues={questionnaireData}
            />
          ) : (
            <ModelView modelId={currentModelId} refreshTrigger={refreshTrigger} />
          )}
        </main>
      </div>
    </div>
  );
}

// Model View Component
function ModelView({ modelId, refreshTrigger }: { modelId: string; refreshTrigger?: number }) {
  const [model, setModel] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModel();
  }, [modelId, refreshTrigger]);

  const loadModel = async () => {
    try {
      setLoading(true);
      const data = await getModel(modelId);
      setModel(data.model);
      setRows(data.rows);
    } catch (error) {
      console.error('Failed to load model:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleView = () => {
    if (!model) return;
    const newViewMode = model.view_mode === 'yearly' ? 'monthly' : 'yearly';
    setModel({ ...model, view_mode: newViewMode });
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-black p-8 text-center">
        <p className="text-xl text-black">Loading model...</p>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="bg-white border-2 border-black p-8 text-center">
        <p className="text-xl text-black">Model not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-black">{model.name}</h2>
          {model.description && (
            <p className="text-gray-600 mt-2">{model.description}</p>
          )}
        </div>

        {/* Monthly/Yearly Toggle */}
        <div className="flex border-2 border-black">
          <button
            onClick={handleToggleView}
            className={`px-4 py-2 font-medium ${
              model.view_mode === 'yearly'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Yearly
          </button>
          <button
            onClick={handleToggleView}
            className={`px-4 py-2 font-medium border-l-2 border-black ${
              model.view_mode === 'monthly'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="border-2 border-black">
        <FinancialTable
          rows={rows}
          viewMode={model.view_mode}
          numPeriods={model.num_periods}
        />
      </div>
    </div>
  );
}

