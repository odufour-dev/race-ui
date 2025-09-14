import React, { useState } from 'react';

/**
 * AppDataModel
 * Encapsulates application data and provides CRUD operations.
 * Usage:
 * <AppDataModel>
 *   {(data, actions) => <RegistrationTable data={data} {...actions} />}
 * </AppDataModel>
 */
function AppDataModel({ children, initialData = [] }) {
  const [data, setData] = useState(initialData);

  // CRUD actions
  const addRow = (row) => setData(prev => [...prev, row]);
  const updateRow = (index, newRow) => setData(prev => prev.map((row, i) => i === index ? newRow : row));
  const deleteRow = (index) => setData(prev => prev.filter((_, i) => i !== index));
  const setAllData = (newData) => setData(newData);

  const actions = { setData, addRow, updateRow, deleteRow, setAllData };

  return children(data, actions);
}

export default AppDataModel;
