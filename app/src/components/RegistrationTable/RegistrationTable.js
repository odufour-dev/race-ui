import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './RegistrationTable.css';
import DropdownEditor from './DropdownEditor';
import TextEditor from './TextEditor';
import ActionPanel from './ActionPanel';

function RegistrationTable({ dataModel, classificationModel, updateModel }) {

  const { t: translator } = useTranslation('RegistrationTable');
  const [data, setData] = useState(dataModel.getAllRacers().map(racer => ({
    bib:        racer.bib,
    lastName:   racer.lastName,
    firstName:  racer.firstName,
    sex:        racer.sex,
    club:       racer.club,
    category:   racer.category,
    age:        racer.age,
    licenseId:  racer.ffcID,
    uciId:      racer.uciID
  })));
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');
  const [sortBy, setSortBy] = useState({ columnKey: null, direction: null });

  const columnDefs = [
    { accessorKey: 'bib',       header: translator('columns.bib'),      enableSorting: true,  enableEditing: true, allowedValues: null, size: 'small' },
    { accessorKey: 'lastName',  header: translator('columns.name'),     enableSorting: true,  enableEditing: true, allowedValues: null, size: 'medium' },
    { accessorKey: 'firstName', header: translator('columns.firstName'),enableSorting: true,  enableEditing: true, allowedValues: null, size: 'small' },
    { accessorKey: 'sex',       header: translator('columns.sex'),      enableSorting: true,  enableEditing: true, allowedValues: classificationModel.Sex, size: 'small' },
    { accessorKey: 'club',      header: translator('columns.club'),     enableSorting: true,  enableEditing: true, allowedValues: null, size: 'large' },
    { accessorKey: 'category',  header: translator('columns.category'), enableSorting: true,  enableEditing: true, allowedValues: classificationModel.Category, size: 'small' },
    { accessorKey: 'age',       header: translator('columns.age'),      enableSorting: true,  enableEditing: true, allowedValues: classificationModel.Age, size: 'small' },
    { accessorKey: 'licenseId', header: translator('columns.licenseId'),enableSorting: true,  enableEditing: true, allowedValues: null, size: 'small' },
    { accessorKey: 'uciId',     header: translator('columns.uciId'),    enableSorting: true,  enableEditing: true, allowedValues: null, size: 'small' }
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
          if (col.allowedValues) {
            return (
              <DropdownEditor
                rowIndex={rowIndex}
                columnKey={columnKey}
                col={col}
                editValue={editValue}
                setEditValue={setEditValue}
                setEditingCell={setEditingCell}
                setData={setData}
                propsRowOriginal={props.row.original}
                colKeys={colKeys}
                data={data}
              />
            );
          } else {
            return (
              <TextEditor
                rowIndex={rowIndex}
                columnKey={columnKey}
                editValue={editValue}
                setEditValue={setEditValue}
                setEditingCell={setEditingCell}
                setData={setData}
                propsRowOriginal={props.row.original}
                colKeys={colKeys}
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

  // Apply sorting if requested
  const sortedData = React.useMemo(() => {
    if (!sortBy.columnKey) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const va = a[sortBy.columnKey] ?? '';
      const vb = b[sortBy.columnKey] ?? '';
      if (typeof va === 'number' && typeof vb === 'number') return va - vb;
      return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' });
    });
    return sortBy.direction === 'asc' ? sorted : sorted.reverse();
  }, [filteredData, sortBy]);

  // Action handlers for panel
  const generateBibs = () => {
    setData(prev => prev.map((row, i) => ({ ...row, bib: i + 1 })));
  };

  const applyAgeToAll = (age) => {
    if (!Number.isFinite(age)) return;
    setData(prev => prev.map(row => ({ ...row, age })));
  };

  const shuffleOrder = () => {
    setData(prev => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  };

  return (
    <>
      <div className="table-bg">
        <div className="table-container">
          <h3 className="text-3xl font-bold text-blue-700 mb-8 text-center">
            {translator('registration.title')}
          </h3>
          {/* Section pour le filtrage global and actions */}
          <div className="actions-panel">
            <div className="panel-left">
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
            </div>
            <div className="panel-center">
              <ActionPanel onGenerateBibs={generateBibs} onApplyAge={applyAgeToAll} onShuffle={shuffleOrder} />
            </div>
            <div className="panel-right">
              <button className="btn btn-primary add-user-btn" onClick={() => {
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
          </div>
          <div className="table-scroll">
            <table className="table w-full border border-gray-200 rounded-lg bg-white">
              <colgroup>
                {columnDefs.map(col => (
                  <col key={col.accessorKey} className={`col-${col.size ?? 'medium'}`} />
                ))}
                <col className="col-actions" />
              </colgroup>
              <thead className="bg-blue-100">
                <tr>
                  {columns.map((col, idx) => {
                    const isSortable = col.enableSorting;
                    const isActive = sortBy.columnKey === col.accessorKey;
                    const arrow = isActive ? (sortBy.direction === 'asc' ? ' ▲' : ' ▼') : '';
                    return (
                      <th
                        key={col.accessorKey}
                        className={`px-4 py-3 text-left font-semibold text-blue-900 ${isSortable ? 'sortable' : ''}`}
                        onClick={() => {
                          if (!isSortable) return;
                          // toggle sort: null -> asc -> desc -> null
                          if (sortBy.columnKey !== col.accessorKey) {
                            setSortBy({ columnKey: col.accessorKey, direction: 'asc' });
                          } else if (sortBy.direction === 'asc') {
                            setSortBy({ columnKey: col.accessorKey, direction: 'desc' });
                          } else {
                            setSortBy({ columnKey: null, direction: null });
                          }
                        }}
                      >
                        {col.header}{arrow}
                      </th>
                    );
                  })}
                  <th className="px-4 py-3 text-left font-semibold text-blue-900">{translator('columns.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, displayIndex) => {
                  // find original index in the unsorted data array so edits/deletes target the correct row
                  const originalIndex = data.indexOf(row);
                  return (
                    <tr key={originalIndex} className="odd:bg-blue-50 even:bg-white hover:bg-blue-100 transition-colors">
                      {columns.map((col) => (
                        <td key={col.accessorKey} className="px-4 py-3 text-base text-gray-900"
                          onClick={() => {
                            setEditingCell({ rowIndex: originalIndex, columnKey: col.accessorKey });
                            setEditValue(row[col.accessorKey] ?? '');
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {col.cell({ row: { index: originalIndex, original: row }, getValue: () => row[col.accessorKey] })}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <button
                          className="hover:bg-gray-200 rounded-full p-1 flex items-center justify-center transition-colors"
                          title="Supprimer la ligne"
                          style={{ width: '2rem', height: '2rem' }}
                          onClick={() => {
                            setData(prev => prev.filter((_, idx) => idx !== originalIndex));
                            setEditingCell(null);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
    </>
  );
}

export default RegistrationTable;