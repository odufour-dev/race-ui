// components/ExcelReader.js

import React, { useState } from 'react';
import { Button, InputGroup } from '@tanstack/react-table';
import * as XLSX from 'xlsx';

const ExcelReader = ({ dataModel }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const readExcelFile = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const data = reader.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheets = workbook.SheetNames;

    // Example usage: get the first sheet's data
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]]);
    setFileContent(sheetData);
  };
  reader.readAsArrayBuffer(file);
};

  const handleSubmit = () => {
    if (selectedFile !== null) {
      readExcelFile(selectedFile);
    }
  };

  return (
    <div className="mx-4">
      <h2 className="text-lg mb-2">Select an Excel File</h2>
      <div>
        <input
          type="file"
          accept=".xlsx, .xls, .xlsm"
          onChange={handleFileChange}
          className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-100 dark:text-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      {selectedFile && (
        <button
          onClick={handleSubmit}
          className="w-full p-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500"
        >
          Read Excel File
        </button>
      )}
      {fileContent && (
        <pre className="mt-4 p-2 text-sm bg-gray-100 rounded-md">
          <code>{JSON.stringify(fileContent, null, 2)}</code>
        </pre>
      )}
    </div>
  );
};

export default ExcelReader;