import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
}

const DataTable = <T extends Record<string, any>>({ columns, data, keyField }: DataTableProps<T>) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-700">
          <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className={`px-4 py-3 text-right font-medium ${column.className ?? ''}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((row) => (
              <tr key={String(row[keyField])} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                {columns.map((column) => {
                  const value = typeof column.accessor === 'function' ? column.accessor(row) : row[column.accessor];
                  return (
                    <td key={column.header} className={`px-4 py-3 text-slate-700 dark:text-slate-100 ${column.className ?? ''}`}>
                      {value as React.ReactNode}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
