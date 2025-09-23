// src/components/ExcelReader.jsx
import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const ExcelReader = () => {
  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [headerRow, setHeaderRow] = useState(4);
  const [nColumns, setColumns] = useState(1);
  const [columnNames, setColumnNames] = useState({});
  const [fileContent, setFileContent] = useState([]);
  const [columnMappings, setColumnMappings] = useState({});

  const mappingOptions = [
    { value: 'Skip', label: 'Skip' },
    { value: 'Name', label: 'Name' },
    { value: 'FirstName', label: 'FirstName' },
    { value: 'UCI ID', label: 'UCI ID' },
    { value: 'Club', label: 'Club' },
    { value: 'Category', label: 'Category' },
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
      const sheetData = XLSX.utils.sheet_to_json(worksheet);
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

      const initialMappings = {};
      for (var i = 0; i < nColumns; i++){
        initialMappings[i] = 'Skip';
      }      
      setColumnMappings(initialMappings);

      console.log(fileContent[irow]);
      const names = Object.keys(fileContent[irow]).map((key) => fileContent[irow][key] || `Column ${key}`);
      for (var i=names.length; i < nColumns; i++){
        names[i] = "EMPTY";
      }
      setColumnNames(names);

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

  const columns = useMemo(() => {
    if (fileContent.length === 0) return [];
    
    const allKeys = new Set(
      fileContent.slice(0, 20).flatMap(row => (typeof row === 'object' && row !== null ? Object.keys(row) : []))
    );
    
    return Array.from(allKeys).map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info) => info.getValue(),
    }));
  }, [fileContent]);

  const tableData = useMemo(() => fileContent.slice(0, 10), [fileContent]);
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Excel File Viewer</h1>
      
      <div className="mb-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full max-w-xs"
          />
      </div>

      <div className="form-control">
        <label className="label py-0">
          <span className="label-text text-xs">Header Row</span>
        </label>
        <input
          type="number"
          value={headerRow}
          onChange={handleHeaderRowChange}
          min="1"
          className="input input-bordered input-sm w-full"
        />
      </div>

      {workbook && fileContent.length > 0 && (
        <div className="overflow-x-auto p-4 border border-gray-300 rounded-md">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                {Object.keys(columnMappings).map((originalKey, index) => (
                  <th key={originalKey} className="bg-white p-2 text-left text-sm font-semibold border border-gray-300">                    
                    <select
                      value={columnMappings[index]}
                      onChange={(e) => handleMappingChange(index, e.target.value)}
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
                {columnNames.map((name,index) => (
                  <th key={name + index} className="bg-gray-100 p-2 text-left text-sm font-semibold border border-gray-300 truncate" title={name}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => {
                    const originalKey = cell.column.id;
                    const isMapped = columnMappings[originalKey] && columnMappings[originalKey] !== 'Skip';
                    return (
                      <td key={cell.id} className={`p-2 border border-gray-300 text-sm ${isMapped ? 'text-black font-medium bg-blue-50' : 'text-gray-600 bg-white'}`}>
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