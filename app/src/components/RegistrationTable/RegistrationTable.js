import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './RegistrationTable.css';

function RegistrationTable({ dataModel }) {
  const { data, setData, categoryOptions, serieOptions } = dataModel;
  const { t: translator } = useTranslation('RegistrationTable');
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');

  const columnDefs = [
    { accessorKey: 'bib', header: translator('columns.bib'), enableSorting: true },
    { accessorKey: 'lastName', header: translator('columns.name'), enableSorting: true },
    { accessorKey: 'firstName', header: translator('columns.firstName'), enableSorting: true },
    { accessorKey: 'club', header: translator('columns.club'), enableSorting: true },
    { accessorKey: 'category', header: translator('columns.category'), enableSorting: true },
    { accessorKey: 'serie', header: translator('columns.serie'), enableSorting: true },
    { accessorKey: 'licenseId', header: translator('columns.licenseId'), enableSorting: true },
    { accessorKey: 'uciId', header: translator('columns.uciId'), enableSorting: true }
  ];

  const columns = useMemo(() =>
    columnDefs.map(col => ({
      ...col,
      cell: (props) => {
        const rowIndex = props.row.index;
        const columnKey = col.accessorKey;
        const isEditing = editingCell && editingCell.rowIndex === rowIndex && editingCell.columnKey === columnKey;
        const colKeys = columnDefs.map(c => c.accessorKey);
        if (isEditing) {
          if (columnKey === 'category' || columnKey === 'serie') {
            const options = columnKey === 'category' ? categoryOptions : serieOptions;
            // Flip dropdown for last 3 rows
            const flipDropdown = rowIndex >= (data ? data.length : 0) - 3;
            return (
              <div className={`dropdown-container${flipDropdown ? ' dropdown-flip' : ''}`}>
                <input
                  type="text"
                  className="dropdown-input"
                  value={editValue}
                  autoFocus
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => setTimeout(() => setEditingCell(null), 150)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setData(prev => prev.map((row, idx) =>
                        idx === rowIndex ? { ...row, [columnKey]: editValue } : row
                      ));
                      setEditingCell(null);
                      e.preventDefault();
                    } else if (e.key === 'Tab') {
                      setData(prev => prev.map((row, idx) =>
                        idx === rowIndex ? { ...row, [columnKey]: editValue } : row
                      ));
                      const currentIdx = colKeys.indexOf(columnKey);
                      if (currentIdx < colKeys.length - 1) {
                        setEditingCell({ rowIndex, columnKey: colKeys[currentIdx + 1] });
                        setEditValue(props.row.original[colKeys[currentIdx + 1]] ?? '');
                      } else {
                        setEditingCell(null);
                      }
                      e.preventDefault();
                    }
                  }}
                  placeholder={columnKey === 'category' ? translator('columns.category') : translator('columns.serie')}
                />
                <ul className="dropdown-list">
                  {options.map(opt => (
                    <li
                      key={opt}
                      className="dropdown-list-item"
                      onMouseDown={() => {
                        setEditValue(opt);
                        setData(prev => prev.map((row, idx) =>
                          idx === rowIndex ? { ...row, [columnKey]: opt } : row
                        ));
                        setEditingCell(null);
                      }}
                    >
                      {opt}
                    </li>
                  ))}
                  {options.length === 0 && (
                    <li className="dropdown-list-empty">{translator('registration.noOption', { defaultValue: '(No option)' })}</li>
                  )}
                </ul>
              </div>
            );
          } else {
            // Editable input for all other cells
            return (
              <input
                type="text"
                className="editable-input"
                value={editValue}
                autoFocus
                onChange={e => setEditValue(e.target.value)}
                onBlur={() => setEditingCell(null)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setData(prev => prev.map((row, idx) =>
                      idx === rowIndex ? { ...row, [columnKey]: editValue } : row
                    ));
                    setEditingCell(null);
                    e.preventDefault();
                  } else if (e.key === 'Tab') {
                    setData(prev => prev.map((row, idx) =>
                      idx === rowIndex ? { ...row, [columnKey]: editValue } : row
                    ));
                    const currentIdx = colKeys.indexOf(columnKey);
                    if (currentIdx < colKeys.length - 1) {
                      setEditingCell({ rowIndex, columnKey: colKeys[currentIdx + 1] });
                      setEditValue(props.row.original[colKeys[currentIdx + 1]] ?? '');
                    } else {
                      setEditingCell(null);
                    }
                    e.preventDefault();
                  }
                }}
              />
            );
          }
        }
        return props.getValue();
      }
    })), [editingCell, editValue, setData]
  );

  // Filter data according to globalFilter (case-insensitive, matches any cell)
  const filteredData = globalFilter
    ? data.filter(row =>
        Object.values(row).some(val =>
          String(val || '').toLowerCase().includes(globalFilter.toLowerCase())
        )
      )
    : data;

  return (
    <>
      <div className="table-bg">
        <div className="table-container">
          <h3 className="text-3xl font-bold text-blue-700 mb-8 text-center">
            {translator('registration.title')}
          </h3>
          {/* Section pour le filtrage global */}
          <div className="filter-row filter-row-inline">
            <div className="filter-input-container">
              <input
                type="text"
                className="filter-input"
                placeholder={translator('registration.filter')}
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
              />
              <span className="filter-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.023A5.479 5.479 0 1 1 11.023 9.965a.75.75 0 0 1-.977.977ZM5.5 10.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md add-user-btn" onClick={() => {
              // Find the max Bib value
              const maxBib = data.length > 0 ? Math.max(...data.map(row => Number(row.bib) || 0)) : 0;
              const newRow = {
                bib: maxBib + 1,
                lastName: '',
                firstName: '',
                club: '',
                category: '',
                serie: '',
                licenseId: '',
                uciId: ''
              };
              setData(prev => [...prev, newRow]);
              setEditingCell({ rowIndex: data.length, columnKey: 'lastName' });
              setEditValue('');
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              {translator('registration.addUser')}
            </button>
          </div>
          <div className="table-scroll">
            <table className="table w-full border border-gray-200 rounded-lg bg-white">
              <thead className="bg-blue-100">
                <tr>
                  {columns.map((col, idx) => (
                    <th key={col.accessorKey} className="px-4 py-3 text-left font-semibold text-blue-900">
                      {col.header}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-semibold text-blue-900">{translator('columns.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="odd:bg-blue-50 even:bg-white hover:bg-blue-100 transition-colors">
                    {columns.map((col) => (
                      <td key={col.accessorKey} className="px-4 py-3 text-base text-gray-900"
                        onClick={() => {
                          setEditingCell({ rowIndex, columnKey: col.accessorKey });
                          setEditValue(row[col.accessorKey] ?? '');
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {col.cell({ row: { index: rowIndex, original: row }, getValue: () => row[col.accessorKey] })}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <button
                        className="hover:bg-gray-200 rounded-full p-1 flex items-center justify-center transition-colors"
                        title="Supprimer la ligne"
                        style={{ width: '2rem', height: '2rem' }}
                        onClick={() => {
                          setData(prev => prev.filter((_, idx) => idx !== rowIndex));
                          setEditingCell(null);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-3 text-center text-blue-700 text-base bg-blue-50">
                    {translator('registration.usersCount', { count: filteredData.length })}
                  </td>
                </tr>
                <tr style={{ height: '200px' }}></tr>
              </tfoot>
              
            </table>
            
          </div>
          {/* Indicateur si aucune donnée n'est trouvée */}
          {/* ...no data message... */}
                    
        </div>
      </div>
      <datalist id="category-options">
        {categoryOptions.map(opt => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
      <datalist id="serie-options">
        {serieOptions.map(opt => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </>
  );
}

export default RegistrationTable;