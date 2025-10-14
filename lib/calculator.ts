import { TableRowWithCells } from './types';

/**
 * Calculation engine for evaluating formulas in table cells
 */

export class FinancialCalculator {
  private rows: Map<string, TableRowWithCells>;
  private rowsByCategory: Map<string, TableRowWithCells>;

  constructor(rows: TableRowWithCells[]) {
    this.rows = new Map(rows.map(row => [row.id, row]));
    this.rowsByCategory = new Map(rows.map(row => [row.category, row]));
  }

  /**
   * Calculate all cells for all rows
   */
  calculateAll(numPeriods: number): void {
    for (let period = 0; period < numPeriods; period++) {
      this.calculatePeriod(period);
    }
  }

  /**
   * Calculate all cells for a specific period
   */
  private calculatePeriod(periodIndex: number): void {
    // Calculate in dependency order
    // For now, we'll do multiple passes until no changes occur
    let changed = true;
    let iterations = 0;
    const maxIterations = 10;

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      for (const row of this.rows.values()) {
        const cell = row.cells.find(c => c.period_index === periodIndex);
        if (cell && cell.value_type === 'formula' && cell.formula) {
          const newValue = this.evaluateFormula(cell.formula, row.category, periodIndex);
          if (newValue !== cell.calculated_value) {
            cell.calculated_value = newValue;
            changed = true;
          }
        } else if (cell && cell.value_type === 'input') {
          cell.calculated_value = cell.input_value;
        }
      }
    }
  }

  /**
   * Evaluate a formula for a specific cell
   */
  private evaluateFormula(formula: string, currentCategory: string, periodIndex: number): number {
    try {
      // Replace formula references with actual values
      let processedFormula = formula;

      // ROW(category) - get value from same period
      processedFormula = processedFormula.replace(/ROW\(([^)]+)\)/g, (_, category) => {
        const value = this.getCellValue(category, periodIndex);
        return value !== null ? value.toString() : '0';
      });

      // PREV(category) - get value from previous period
      processedFormula = processedFormula.replace(/PREV\(([^)]+)\)/g, (_, category) => {
        if (periodIndex === 0) return '0';
        const value = this.getCellValue(category, periodIndex - 1);
        return value !== null ? value.toString() : '0';
      });

      // SUM(row_type) - sum all rows of a certain type in current period
      processedFormula = processedFormula.replace(/SUM\(([^)]+)\)/g, (_, rowType) => {
        const sum = this.sumByType(rowType, periodIndex);
        return sum.toString();
      });

      // Evaluate the mathematical expression
      // Note: In production, use a proper expression parser like mathjs
      // For now, we'll use Function constructor (be careful in production!)
      const result = new Function('return ' + processedFormula)();

      return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
      console.error('Error evaluating formula:', formula, error);
      return 0;
    }
  }

  /**
   * Get cell value by category and period
   */
  private getCellValue(category: string, periodIndex: number): number | null {
    const row = this.rowsByCategory.get(category);
    if (!row) return null;

    const cell = row.cells.find(c => c.period_index === periodIndex);
    return cell?.calculated_value ?? cell?.input_value ?? null;
  }

  /**
   * Sum all rows of a certain type for a period
   */
  private sumByType(rowType: string, periodIndex: number): number {
    let sum = 0;
    for (const row of this.rows.values()) {
      if (row.row_type === rowType) {
        const cell = row.cells.find(c => c.period_index === periodIndex);
        const value = cell?.calculated_value ?? cell?.input_value ?? 0;
        sum += value;
      }
    }
    return sum;
  }

  /**
   * Get all calculated values for export
   */
  getCalculatedRows(): TableRowWithCells[] {
    return Array.from(this.rows.values());
  }
}

/**
 * Helper function to format currency
 */
export function formatCurrency(value: number | null): string {
  if (value === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Helper function to format percentage
 */
export function formatPercentage(value: number | null): string {
  if (value === null) return '0%';
  return `${value}%`;
}

/**
 * Helper function to format number
 */
export function formatNumber(value: number | null): string {
  if (value === null) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
