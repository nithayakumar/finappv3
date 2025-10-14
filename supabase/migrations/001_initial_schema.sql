-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Models table (the main financial model)
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  view_mode TEXT NOT NULL DEFAULT 'yearly' CHECK (view_mode IN ('monthly', 'yearly')),
  num_periods INTEGER NOT NULL DEFAULT 10,
  is_public BOOLEAN NOT NULL DEFAULT false,
  public_share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table rows (each row in the financial table)
CREATE TABLE table_rows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  row_type TEXT NOT NULL CHECK (row_type IN ('income', 'expense', 'debt', 'investment', 'calculation')),
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  parent_row_id UUID REFERENCES table_rows(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_editable BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table cells (values in each cell)
CREATE TABLE table_cells (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  row_id UUID NOT NULL REFERENCES table_rows(id) ON DELETE CASCADE,
  period_index INTEGER NOT NULL,
  value_type TEXT NOT NULL CHECK (value_type IN ('input', 'formula', 'percentage')),
  input_value DECIMAL(15, 2),
  formula TEXT,
  calculated_value DECIMAL(15, 2),
  display_format TEXT NOT NULL DEFAULT 'currency' CHECK (display_format IN ('currency', 'percentage', 'number')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(row_id, period_index)
);

-- Formulas table (reusable calculation templates)
CREATE TABLE formulas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  formula_template TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_table_rows_model_id ON table_rows(model_id);
CREATE INDEX idx_table_rows_display_order ON table_rows(model_id, display_order);
CREATE INDEX idx_table_cells_row_id ON table_cells(row_id);
CREATE INDEX idx_table_cells_period ON table_cells(row_id, period_index);
CREATE INDEX idx_models_public_token ON models(public_share_token) WHERE public_share_token IS NOT NULL;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_table_cells_updated_at
  BEFORE UPDATE ON table_cells
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
DECLARE
  token TEXT;
  done BOOLEAN := false;
BEGIN
  WHILE NOT done LOOP
    token := encode(gen_random_bytes(12), 'base64');
    token := replace(replace(replace(token, '/', '_'), '+', '-'), '=', '');
    done := NOT EXISTS(SELECT 1 FROM models WHERE public_share_token = token);
  END LOOP;
  RETURN token;
END;
$$ LANGUAGE plpgsql;
