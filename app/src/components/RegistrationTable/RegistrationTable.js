import React, { useMemo, useState } from 'react';

function RegistrationTable({ data, setData, categoryOptions, serieOptions }) {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');

  const columnDefs = [
    { accessorKey: 'bib', header: 'Bib', enableSorting: true },
    { accessorKey: 'lastName', header: 'Name', enableSorting: true },
    { accessorKey: 'firstName', header: 'First name', enableSorting: true },
    { accessorKey: 'club', header: 'Club', enableSorting: true },
    { accessorKey: 'category', header: 'Category', enableSorting: true },
    { accessorKey: 'serie', header: 'Serie', enableSorting: true },
    { accessorKey: 'licenseId', header: 'License ID', enableSorting: true },
    { accessorKey: 'uciId', header: 'UCI ID', enableSorting: true }
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
            return (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="border border-blue-300 bg-white text-gray-900 py-1 text-base rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  style={{ minWidth: 0, height: '2.25rem', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
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
                  placeholder={columnKey === 'category' ? 'Choisir une catégorie...' : 'Choisir une série...'}
                />
                <ul style={{ position: 'absolute', zIndex: 10, background: 'white', border: '1px solid #cbd5e1', width: '100%', maxHeight: 150, overflowY: 'auto', margin: 0, padding: 0, listStyle: 'none' }}>
                  {options.map(opt => (
                    <li
                      key={opt}
                      style={{ padding: '0.5rem', cursor: 'pointer' }}
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
                    <li style={{ padding: '0.5rem', color: '#888' }}>(Aucune option)</li>
                  )}
                </ul>
              </div>
            );
          } else {
            // Editable input for all other cells
            return (
              <input
                type="text"
                className="border border-blue-300 bg-white text-gray-900 py-1 text-base rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                style={{ minWidth: 0, height: '2.25rem', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
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

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl p-8">
          <h3 className="text-3xl font-bold text-blue-700 mb-8 text-center">
            Tableau des Utilisateurs (TanStack Table + DaisyUI)
          </h3>
          {/* Section pour le filtrage global */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 rounded-lg border border-blue-300 bg-white text-blue-900 placeholder-blue-400 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                placeholder="Filtrer tout..."
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
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
            <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md" onClick={() => {
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
              Ajouter utilisateur
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full border border-gray-200 rounded-lg bg-white">
              <thead className="bg-blue-100">
                {columns.map((col, idx) => (
                  <th key={col.accessorKey} className="px-4 py-3 text-left font-semibold text-blue-900">
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-left font-semibold text-blue-900">Actions</th>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="odd:bg-blue-50 even:bg-white hover:bg-blue-100 transition-colors">
                    {columns.map((col) => (
                      <td key={col.accessorKey} className="px-4 py-3 text-base text-gray-900"
                        onClick={() => {
                          setEditingCell({ rowIndex, columnKey: col.accessorKey });
                          setEditValue(data[rowIndex][col.accessorKey] ?? '');
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
                    Nombre d'utilisateurs : {data.length}
                  </td>
                </tr>
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