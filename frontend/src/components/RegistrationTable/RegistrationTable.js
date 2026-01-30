import React, { useEffect, useMemo, useState } from 'react';
import './RegistrationTable.css';
import DropdownEditor from './DropdownEditor';
import TextEditor from './TextEditor';
import ActionPanel from './ActionPanel';

function RegistrationTable({ helper, connector, competitionid, savebar }) {

  const [dataModel,     setDataModel]     = useState(null);
  const [editingCell,   setEditingCell]   = useState(null);
  const [editValue,     setEditValue]     = useState('');
  const [globalFilter,  setGlobalFilter]  = useState('');
  const [sortBy,        setSortBy]        = useState({ columnKey: null, direction: null });
  const [filteredData,  setFilteredData]  = useState([]);
  const [isDirty,       setIsDirty]       = useState(false);

  const classificationModel = {
    Level:    ['elite','open','access'],
    Category: ['pro','elite','open1','open2','open3','access1','access2','access3','access4'],
    Age:      ['senior','master','veteran','u23','u19','u17','u15','u13','u11','u9','u7'],
    Sex:      ['H','F']
  }
  useEffect(() => {
      connector.fetchRacers(competitionid)
          .then(manager => {
              setDataModel(manager);
          })
          .catch(err => console.error(err));
  }, [competitionid, connector]);

  const columnDefs = useMemo(() => [
    { accessorKey: 'id',        header: helper.translator('columns.bib'),      enableSorting: true,  enableEditing: true, allowedValues: null, size: 'small' },
    { accessorKey: 'lastName',  header: helper.translator('columns.name'),     enableSorting: true,  enableEditing: true, allowedValues: null, size: 'medium' },
    { accessorKey: 'firstName', header: helper.translator('columns.firstName'),enableSorting: true,  enableEditing: true, allowedValues: null, size: 'small' },
    { accessorKey: 'sex',       header: helper.translator('columns.sex'),      enableSorting: true,  enableEditing: true, allowedValues: classificationModel.Sex, size: 'small' },
    { accessorKey: 'club',      header: helper.translator('columns.club'),     enableSorting: true,  enableEditing: true, allowedValues: null, size: 'large' },
    { accessorKey: 'category',  header: helper.translator('columns.category'), enableSorting: true,  enableEditing: true, allowedValues: classificationModel.Category, size: 'small' },
    { accessorKey: 'age',       header: helper.translator('columns.age'),      enableSorting: true,  enableEditing: true, allowedValues: classificationModel.Age, size: 'small' },
    { accessorKey: 'ffcID',     header: helper.translator('columns.licenseId'),enableSorting: true,  enableEditing: true, allowedValues: null, size: 'small' },
    { accessorKey: 'uciID',     header: helper.translator('columns.uciId'),    enableSorting: true,  enableEditing: true, allowedValues: null, size: 'small' }
  ], [ classificationModel]);

  const next = (rowIndex, columnIndex) => {
    return {
      up: () => {
        if (rowIndex > 0) {
          setEditingCell({ rowIndex: rowIndex - 1, columnKey: columnDefs[columnIndex].accessorKey });
          setEditValue(filteredData[rowIndex - 1][columnDefs[columnIndex].accessorKey] ?? '');
        } else {
          setEditingCell(null);
        }
      },
      down: () => {
        // If not on last row, move to the next row in the same column
        if (rowIndex < filteredData.length - 1) {
          setEditingCell({ rowIndex: rowIndex + 1, columnKey: columnDefs[columnIndex].accessorKey });
          setEditValue(filteredData[rowIndex + 1][columnDefs[columnIndex].accessorKey] ?? '');
        } else {
          // If on the last row, create a new racer and start editing the new last row's lastName
          const newIndex = addRacer();
          setEditingCell({ rowIndex: newIndex, columnKey: 'lastName' });
          setEditValue('');
        }
      },
      left: () => {
        if (columnIndex > 0) {
          setEditingCell({ rowIndex, columnKey: columnDefs[columnIndex - 1].accessorKey });
          setEditValue(filteredData[rowIndex][columnDefs[columnIndex - 1].accessorKey] ?? '');
        } else {
          setEditingCell(null);
        }
      },
      right: () => {
        if (columnIndex < columnDefs.length - 1) {
          setEditingCell({ rowIndex, columnKey: columnDefs[columnIndex + 1].accessorKey });
          setEditValue(filteredData[rowIndex][columnDefs[columnIndex + 1].accessorKey] ?? '');
        } else {
          setEditingCell(null);
        }
      },
      none: () => {setEditingCell(null);}}
  };

  const editProperty = (rowIndex, columnKey, newValue) => {
    setEditValue(newValue);
    if (dataModel){
      setDataModel(dataModel.edit(rowIndex,columnKey,newValue));
    }
  };

  const addRacer = () => {
    if (dataModel){
      // Append a new racer via the dataModel and return the new index
      const result = dataModel.add([]);
      setDataModel(result);
      // Try to determine the new index from dataModel.getAll() if available
      const all = typeof dataModel.getAll === 'function' ? dataModel.getAll() : (Array.isArray(result) ? result : []);
      return Math.max(0, all.length - 1);
    }
  }

  const removeRacer = (index) => {
    if (dataModel){
      setDataModel(dataModel.remove(index));
    }
  }

  const columns = useMemo(() =>
    columnDefs.map((col, colIndex) => ({
      ...col,
      cell: (props) => {
        const rowIndex = props.row.index;
        const columnKey = col.accessorKey;
        const isEditing = editingCell && editingCell.rowIndex === rowIndex && editingCell.columnKey === columnKey;
        const colKeys = columnDefs.map(c => c.accessorKey);
        if (isEditing) {
          if (col.allowedValues) {
            return (
              <DropdownEditor allowedValues={col.allowedValues} value={editValue} setData={(value) => editProperty(rowIndex, columnKey, value)} next={next(rowIndex,colIndex)} />
            );
          } else {
            return (
              <TextEditor value={editValue} setData={(value) => editProperty(rowIndex, columnKey, value)} next={next(rowIndex, colIndex)} />
            );
          }
        }
        return props.getValue();
      }
    })), [editingCell, editValue, filteredData, columnDefs]
  );

  useEffect(() => {
    const data = dataModel ? dataModel.getAll() : [];
    if (globalFilter){
      setFilteredData(data.filter(row =>
        Object.values(row).some(val =>
          String(val || '').toLowerCase().includes(globalFilter.toLowerCase())
        )
      ))
    } else {
      setFilteredData(data);
    }
    
  }, [dataModel, globalFilter])

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
    if (dataModel){
      dataModel.generateIds();
      setDataModel(dataModel);
    }
  };

  const applyAgeToAll = (age) => {
    console.log("TODO: apply age to all racers:", age);
  };

  const shuffleOrder = () => {
    if (dataModel){
      dataModel.shuffleRacers();
      setDataModel(dataModel);
    }
  };

  const saveCallback = async () => {
        // const jsondata = data.upd = data.updateFromRankingAndStatus(timeRanking, bibsStatus).toJSON();
        // await connector.saveStageRanking(competitionid, stage, jsondata);
        setIsDirty(false);
    };

  return (
    <>
      {savebar(isDirty,saveCallback)}
      <div className="table-bg">
        <div className="table-container">
          <h3 className="text-3xl font-bold text-blue-700 mb-8 text-center">
            {helper.translator('registration.title')}
          </h3>
          {/* Section pour le filtrage global and actions */}
          <div className="actions-panel">
            <div className="panel-left">
              <div className="filter-input-container">
                <input
                  type="text"
                  className="filter-input"
                  placeholder={helper.translator('registration.filter')}
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
              <ActionPanel onGenerateBibs={generateBibs} onApplyAge={applyAgeToAll} onShuffle={shuffleOrder} data={filteredData} columnDefs={columnDefs} />              
            </div>
            <div className="panel-right">
              {/* Add user button moved to table footer */}
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
                  <th className="px-4 py-3 text-left font-semibold text-blue-900">{helper.translator('columns.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, displayIndex) => {
                  // find original index in the unsorted data array so edits/deletes target the correct row
                  const originalIndex = filteredData.indexOf(row);
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
                            removeRacer(originalIndex);
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
                    {helper.translator('registration.usersCount', { count: filteredData.length })}
                  </td>
                </tr>
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-3 text-center bg-white">
                    <button className="btn btn-primary add-user-btn" onClick={() => {
                      const newIndex = addRacer();
                      setEditingCell({ rowIndex: newIndex, columnKey: 'lastName' });
                      setEditValue('');
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      {helper.translator('registration.addUser')}
                    </button>
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