export type ViewMode = 'monthly' | 'yearly';
export type RowType = 'income' | 'expense' | 'debt' | 'investment' | 'calculation';
export type ValueType = 'input' | 'formula' | 'percentage';
export type DisplayFormat = 'currency' | 'percentage' | 'number';

export interface Model {
  id: string;
  name: string;
  description: string | null;
  view_mode: ViewMode;
  num_periods: number;
  is_public: boolean;
  public_share_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface TableRow {
  id: string;
  model_id: string;
  row_type: RowType;
  category: string;
  label: string;
  parent_row_id: string | null;
  display_order: number;
  is_editable: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface TableCell {
  id: string;
  row_id: string;
  period_index: number;
  value_type: ValueType;
  input_value: number | null;
  formula: string | null;
  calculated_value: number | null;
  display_format: DisplayFormat;
  created_at: string;
  updated_at: string;
}

export interface Formula {
  id: string;
  name: string;
  description: string | null;
  formula_template: string;
  created_at: string;
}

// For the questionnaire initial data
export interface QuestionnaireData {
  annualSalary: number;
  age: number;
  targetRetirementAge: number;
}

// Extended row with cells for rendering
export interface TableRowWithCells extends TableRow {
  cells: TableCell[];
}
