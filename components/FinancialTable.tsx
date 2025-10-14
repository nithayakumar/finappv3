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
  const formatValue = (cell: { calculated_value: number | null; input_value: number | null; display_format: string }) => {
    const value = cell.calculated_value ?? cell.input_value;
    if (value === null) return '-';

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
            className="px-4 py-2 font-semibold text-gray-700 text-sm uppercase tracking-wide"
          >
            {title}
          </td>
        </tr>
        {groupRows
          .sort((a, b) => a.display_order - b.display_order)
          .map((row) => (
            <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 text-left text-gray-900 whitespace-nowrap">
                {row.label}
              </td>
              {Array.from({ length: numPeriods }).map((_, periodIndex) => {
                const cell = row.cells.find((c) => c.period_index === periodIndex);
                const isEditable = row.is_editable && cell?.value_type === 'input';

                return (
                  <td
                    key={periodIndex}
                    className="px-4 py-3 text-right text-gray-700 whitespace-nowrap"
                  >
                    {isEditable ? (
                      <input
                        type="number"
                        value={cell.input_value ?? ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && onCellEdit) {
                            onCellEdit(row.id, periodIndex, value);
                          }
                        }}
                        className="w-full text-right border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span title={cell?.formula || undefined}>
                        {cell ? formatValue(cell) : '-'}
                      </span>
                    )}
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
          <tr className="border-b-2 border-gray-300">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-white">
              Line Item
            </th>
            {Array.from({ length: numPeriods }).map((_, index) => (
              <th
                key={index}
                className="px-4 py-3 text-right text-sm font-semibold text-gray-900 whitespace-nowrap"
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
