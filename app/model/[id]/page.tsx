'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FinancialTable from '@/components/FinancialTable';
import { getModel } from '@/lib/modelService';
import { Model, TableRowWithCells, ViewMode } from '@/lib/types';

export default function ModelPage() {
  const params = useParams();
  const router = useRouter();
  const modelId = params.id as string;

  const [model, setModel] = useState<Model | null>(null);
  const [rows, setRows] = useState<TableRowWithCells[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModel();
  }, [modelId]);

  const loadModel = async () => {
    try {
      setLoading(true);
      const data = await getModel(modelId);
      setModel(data.model);
      setRows(data.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model');
    } finally {
      setLoading(false);
    }
  };

  const handleCellEdit = (rowId: string, periodIndex: number, value: number) => {
    // Update local state optimistically
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            cells: row.cells.map((cell) =>
              cell.period_index === periodIndex
                ? { ...cell, input_value: value, calculated_value: value }
                : cell
            ),
          };
        }
        return row;
      })
    );

    // TODO: Persist to database
  };

  const handleToggleView = () => {
    if (!model) return;
    const newViewMode: ViewMode = model.view_mode === 'yearly' ? 'monthly' : 'yearly';
    setModel({ ...model, view_mode: newViewMode });
    // TODO: Persist to database
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-black mb-4">{error || 'Model not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-black text-white px-6 py-2 font-medium hover:bg-gray-800"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-black">{model.name}</h1>
            {model.description && (
              <p className="text-gray-600 mt-2">{model.description}</p>
            )}
          </div>
          <button
            onClick={() => router.push('/')}
            className="border-2 border-black text-black px-4 py-2 font-medium hover:bg-gray-100"
          >
            New Model
          </button>
        </div>

        {/* Controls */}
        <div className="mb-6 flex gap-4 items-center">
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

          <span className="text-sm text-gray-600">
            Showing {model.num_periods} {model.view_mode === 'yearly' ? 'years' : 'months'}
          </span>
        </div>

        {/* Table */}
        <div className="border-2 border-black">
          <FinancialTable
            rows={rows}
            viewMode={model.view_mode}
            numPeriods={model.num_periods}
            onCellEdit={handleCellEdit}
          />
        </div>
      </div>
    </div>
  );
}
