// src/components/ExcelReader.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const ExcelReader = ( {dataModel} ) => {

  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [headerRow, setHeaderRow] = useState(4);
  const [nColumns, setColumns] = useState(1);
  const [columnNames, setColumnNames] = useState([]);
  const [fileContent, setFileContent] = useState([]);
  const [columnMappings, setColumnMappings] = useState({});

  const { t: translator } = useTranslation('ExcelReader');

  const mappingOptions = [
    { value: 'skip', label: translator('mapping.skip') },
    ...dataModel.getFields().map(field =>({ value: field, label: translator(`mapping.${field}`) }))
  ];

  // STEP 1: Read the file and create the workbook object ONCE.
  // This effect runs only when the `file` state changes.
  useEffect(() => {
    if (!file) {
      setWorkbook(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const wb = XLSX.read(data, { type: 'binary' });
        setWorkbook(wb);
      } catch (error) {
        console.error("Error reading file:", error);
        setWorkbook(null);
      }
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  // It runs when the workbook is ready.
  useEffect(() => {
    if (!workbook) {
      setFileContent([]);
      return;
    }
    try {
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, {defval:""});
      setFileContent(sheetData);
    } catch (error) {
      console.error("Error parsing sheet:", error);
      setFileContent([]);
    }
  }, [workbook]);

  // Effect to initialize column mappings when file content changes (no change here)
  useEffect(() => {
    
    const irow = headerRow - 1;
    if (fileContent.length > irow && typeof fileContent[irow] === 'object' && fileContent[irow] !== null) {

      const nColumns = fileContent.reduce((max, row) => {
        return Math.max(max, Object.keys(row).length);
      }, 0);
      setColumns(nColumns);

      const colnames = Object.keys(fileContent[irow] || {}).map((i) => fileContent[irow][i]);      
      const mapidx = colnames.map((c) => mappingOptions.findIndex((o) => c == o.label));
      setColumnMappings(mapidx.map((i) => i > -1 ? mappingOptions[i].value : "skip"));
      setColumnNames(colnames);

    } else {
      setColumns(nColumns);
      setColumnMappings({});
      setColumnNames([]);
    }
  }, [fileContent,headerRow]);

  const handleHeaderRowChange = (e) => {
    setHeaderRow(parseInt(e.target.value, 10) || 1);
  };

  const handleMappingChange = (index, mappedValue) => {
    setColumnMappings(prev => ({
      ...prev,
      [index]: mappedValue,
    }));
  };

  const handleImportData = () => {

    dataModel.clear();
    fileContent.slice(headerRow).map((row) => {
      const keys = Object.keys(row);
      var data = {};
      keys.map((v,i) => {
        if (columnMappings[i] && columnMappings[i] != 'skip'){        
          data[columnMappings[i]] = row[v];
        }
      });
      dataModel.add(data);
    });

  };

  const columns = useMemo(() => {
    if (fileContent.length === 0) return [];
    
    const allKeys = new Set(
      fileContent.slice(0, 10).flatMap(row => (typeof row === 'object' && row !== null ? Object.keys(row) : []))
    );

    return Array.from(allKeys).map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info) => info.getValue(),
    }));
  }, [fileContent]);

  const table = useReactTable({
    data: fileContent,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);
  }

  const highlightStyle = 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 font-semibold';

  return (
    <div className="container mx-auto p-4">
      <div className="p-6 bg-base-200 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary">Excel File Viewer</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Upload */}
          <div>
            <label className="label">
              <span className="label-text">Upload Excel File</span>
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
            />
          </div>

          {/* Header Row Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Header Row</span>
            </label>
            <input
              type="number"
              value={headerRow}
              onChange={handleHeaderRowChange}
              min="1"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          {/*<button className="btn btn-outline btn-primary">Load File</button>*/}
          <button className="btn btn-primary" onClick={(e)=>handleImportData()}>Import Data</button>
        </div>
      </div>

      {workbook && fileContent.length > 0 && (
        <div className="overflow-x-auto p-4 border border-gray-300 rounded-md">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                {columns.map((col,idx) => (
                  <th key={col.accessorKey} className="bg-white p-2 text-left text-sm font-semibold border border-gray-300">
                    <select
                      value={columnMappings[idx] || 'skip'}
                      onChange={(e) => handleMappingChange(idx, e.target.value)}
                      className="select select-bordered select-sm w-full"
                    >
                      {mappingOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
              <tr>
              {columns.map((col, index) => {
                const isMapped = columnMappings[index] != 'skip';
                return (
                  <th
                    key={col.accessorKey}
                    className={`p-2 border border-gray-300 text-left text-sm font-semibold truncate ${
                      isMapped ? highlightStyle : 'bg-gray-100 text-gray-700'
                    }`}
                    title={columnNames[index]}
                  >
                    {columnNames[index]}
                  </th>
                );
              })}
            </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell,i) => {
                    const isMapped = columnMappings[i] != 'skip';
                    return (
                      <td
                        key={cell.id}
                        className={`min-w-[120px] p-2 border border-gray-300 text-sm ${
                          isMapped ? highlightStyle : 'bg-white text-gray-600'
                        }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelReader;