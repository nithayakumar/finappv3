import { supabase } from './supabase';
import { Model, TableRow, TableCell } from './types';

interface CreateModelParams {
  annualSalary: number;
  age: number;
  targetRetirementAge: number;
}

/**
 * Create a financial model with initial data from questionnaire
 */
export async function createModel(params: CreateModelParams) {
  const { annualSalary, age, targetRetirementAge } = params;
  const workingYears = targetRetirementAge - age;

  // Create the model
  const { data: model, error: modelError } = await supabase
    .from('models')
    .insert({
      name: 'My Financial Plan',
      description: `Planning for ${workingYears} working years`,
      view_mode: 'yearly',
      num_periods: workingYears,
    })
    .select()
    .single();

  if (modelError || !model) {
    throw new Error('Failed to create model: ' + modelError?.message);
  }

  // Create initial rows
  const rows = [
    {
      model_id: model.id,
      row_type: 'income',
      category: 'annual_salary',
      label: 'Annual Salary',
      display_order: 1,
      is_editable: true,
    },
  ];

  const { data: createdRows, error: rowsError } = await supabase
    .from('table_rows')
    .insert(rows)
    .select();

  if (rowsError || !createdRows) {
    throw new Error('Failed to create rows: ' + rowsError?.message);
  }

  // Create cells for annual salary (one for each year)
  const cells: Omit<TableCell, 'id' | 'created_at' | 'updated_at'>[] = [];
  const salaryRow = createdRows[0];

  for (let i = 0; i < workingYears; i++) {
    cells.push({
      row_id: salaryRow.id,
      period_index: i,
      value_type: 'input',
      input_value: annualSalary,
      formula: null,
      calculated_value: annualSalary,
      display_format: 'currency',
    });
  }

  const { error: cellsError } = await supabase.from('table_cells').insert(cells);

  if (cellsError) {
    throw new Error('Failed to create cells: ' + cellsError.message);
  }

  return model;
}

/**
 * Get a model with all its rows and cells
 */
export async function getModel(modelId: string) {
  const { data: model, error: modelError } = await supabase
    .from('models')
    .select('*')
    .eq('id', modelId)
    .single();

  if (modelError || !model) {
    throw new Error('Model not found');
  }

  const { data: rows, error: rowsError } = await supabase
    .from('table_rows')
    .select('*')
    .eq('model_id', modelId)
    .order('display_order');

  if (rowsError) {
    throw new Error('Failed to fetch rows');
  }

  const { data: cells, error: cellsError } = await supabase
    .from('table_cells')
    .select('*')
    .in(
      'row_id',
      rows.map((r) => r.id)
    )
    .order('period_index');

  if (cellsError) {
    throw new Error('Failed to fetch cells');
  }

  // Combine rows with their cells
  const rowsWithCells = rows.map((row) => ({
    ...row,
    cells: cells.filter((cell) => cell.row_id === row.id),
  }));

  return {
    model,
    rows: rowsWithCells,
  };
}

/**
 * Update a cell value
 */
export async function updateCellValue(
  cellId: string,
  value: number
): Promise<void> {
  const { error } = await supabase
    .from('table_cells')
    .update({
      input_value: value,
      calculated_value: value,
    })
    .eq('id', cellId);

  if (error) {
    throw new Error('Failed to update cell: ' + error.message);
  }
}
