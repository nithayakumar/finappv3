'use client';

import { TableRowWithCells, ViewMode } from '@/lib/types';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/calculator';

interface FinancialTableProps {
  rows: TableRowWithCells[];
  viewMode: ViewMode;
  numPeriods: number;
  onCellEdit?: (rowId: string, periodIndex: number, value: number) => void;
}

export default function FinancialTable({
  rows,
  viewMode,
  numPeriods,
  onCellEdit,
}: FinancialTableProps) {
  const formatValue = (cell: { calculated_value: number | null; input_value: number | null; display_format: string }, isMonthlyView: boolean = false) => {
    let value = cell.calculated_value ?? cell.input_value;
    if (value === null) return '-';

    // If in monthly view and it's a currency, divide by 12 to get monthly amount
    if (isMonthlyView && cell.display_format === 'currency') {
      value = value / 12;
    }

    switch (cell.display_format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'number':
        return formatNumber(value);
      default:
        return value.toString();
    }
  };

  const getPeriodLabel = (index: number) => {
    if (viewMode === 'yearly') {
      return `Year ${index + 1}`;
    } else {
      return `Month ${index + 1}`;
    }
  };

  // Group rows by type for better organization
  const groupedRows: { [key: string]: TableRowWithCells[] } = {};
  rows.forEach((row) => {
    if (!groupedRows[row.row_type]) {
      groupedRows[row.row_type] = [];
    }
    groupedRows[row.row_type].push(row);
  });

  const renderRowGroup = (type: string, title: string) => {
    const groupRows = groupedRows[type] || [];
    if (groupRows.length === 0) return null;

    return (
      <>
        <tr className="bg-gray-50">
          <td
            colSpan={numPeriods + 1}
            className="px-6 py-3 font-bold text-black text-base uppercase tracking-wide"
          >
            {title}
          </td>
        </tr>
        {groupRows
          .sort((a, b) => a.display_order - b.display_order)
          .map((row) => (
            <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-left text-black text-base font-medium whitespace-nowrap">
                {row.label}
              </td>
              {Array.from({ length: numPeriods }).map((_, periodIndex) => {
                const cell = row.cells.find((c) => c.period_index === periodIndex);

                return (
                  <td
                    key={periodIndex}
                    className="px-6 py-4 text-right text-black text-base whitespace-nowrap"
                  >
                    <span title={cell?.formula || undefined}>
                      {cell ? formatValue(cell, viewMode === 'monthly') : '-'}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
      </>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="px-6 py-4 text-left text-base font-bold text-black sticky left-0 bg-white">
              Line Item
            </th>
            {Array.from({ length: numPeriods }).map((_, index) => (
              <th
                key={index}
                className="px-6 py-4 text-right text-base font-bold text-black whitespace-nowrap"
              >
                {getPeriodLabel(index)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderRowGroup('income', 'Income')}
          {renderRowGroup('expense', 'Expenses')}
          {renderRowGroup('debt', 'Debt')}
          {renderRowGroup('investment', 'Investments')}
          {renderRowGroup('calculation', 'Net Calculations')}
        </tbody>
      </table>
    </div>
  );
}
