// src/components/ExcelReader.jsx
import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const ExcelReader = () => {
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

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setFileContent(sheetData);
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (fileContent.length > 0) {
      const initialMappings = {};
      const allKeys = new Set();
      const sampleSize = Math.min(fileContent.length, 20);
      for (let i = 0; i < sampleSize; i++) {
        Object.keys(fileContent[i]).forEach(key => allKeys.add(key));
      }
      Array.from(allKeys).forEach(key => {
        initialMappings[key] = 'Skip';
      });
      setColumnMappings(initialMappings);
    }
  }, [fileContent]);

  const handleMappingChange = (originalKey, mappedValue) => {
    setColumnMappings(prev => ({
      ...prev,
      [originalKey]: mappedValue,
    }));
  };

  const columns = useMemo(() => {
    if (fileContent.length === 0) {
      return [];
    }
    const allKeys = new Set();
    const sampleSize = Math.min(fileContent.length, 20);
    for (let i = 0; i < sampleSize; i++) {
      Object.keys(fileContent[i]).forEach(key => allKeys.add(key));
    }
    const originalKeys = Array.from(allKeys);
    
    return originalKeys.map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info) => info.getValue(),
    }));
  }, [fileContent]);

  const table = useReactTable({
    data: fileContent.slice(0, 10),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const firstOriginalKey = Object.keys(columnMappings)[0];
  const firstColumnIsMapped = firstOriginalKey && columnMappings[firstOriginalKey] !== 'Skip';
  const tableTextColorClass = firstColumnIsMapped ? 'text-black' : 'text-gray-500';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Excel File Viewer</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            readExcelFile(file);
          }
        }}
        className="file-input file-input-bordered w-full max-w-xs mb-4"
      />
      
      {fileContent.length > 0 && (
        <div className="overflow-x-auto p-4 border border-gray-300">
          <table className="table-auto w-full border-collapse">
            <thead>
              {/* Row 1: Dropdown Menus */}
              <tr>
                {Object.keys(columnMappings).map((originalKey) => (
                  <th 
                    key={originalKey} 
                    className="bg-white p-2 text-left text-sm font-semibold border border-gray-300"
                  >
                    <select
                      value={columnMappings[originalKey]}
                      onChange={(e) => handleMappingChange(originalKey, e.target.value)}
                      className="w-full h-8 border border-gray-300 bg-white"
                    >
                      {mappingOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
              {/* Row 2: Original Column Names (or Mapped Names if set) */}
              <tr>
                {Object.keys(columnMappings).map((originalKey) => {
                  const mappedValue = columnMappings[originalKey];
                  return (
                    <th 
                      key={originalKey} 
                      className="bg-gray-100 p-2 text-left text-sm font-semibold border border-gray-300"
                    >
                      {mappedValue !== 'Skip' ? mappedValue : originalKey}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id} 
                      className={`bg-white p-2 border border-gray-300 text-sm ${tableTextColorClass}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
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