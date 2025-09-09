/*
 * Usage : <EditableTable initialData={tableData} />
 */

import React, { useState } from 'react';
import './EditableTable.css'; // Pour le style

const EditableTable = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [editingCell, setEditingCell] = useState(null); // { rowId, colId }

  // Gère le changement de valeur dans une cellule lorsqu'elle est en mode édition
  const handleCellChange = (rowId, colId, value) => {
    const updatedData = data.map(row => {
      if (row.id === rowId) {
        return { ...row, [colId]: value };
      }
      return row;
    });
    setData(updatedData);
  };

  // Passe une cellule en mode édition
  const handleEditStart = (rowId, colId) => {
    setEditingCell({ rowId, colId });
  };

  // Termine le mode édition (par exemple, au clic en dehors de la cellule)
  const handleEditEnd = () => {
    setEditingCell(null);
  };

  // Renvoie la valeur d'une cellule, soit le texte, soit un input si en mode édition
  const renderCell = (row, col) => {
    const isEditing = editingCell && editingCell.rowId === row.id && editingCell.colId === col.id;
    const cellValue = row[col.id];

    return (
      <td
        key={col.id}
        className={`cell ${isEditing ? 'editing' : ''}`}
        onClick={() => handleEditStart(row.id, col.id)}
        // Utiliser onBlur pour terminer l'édition lorsque le focus est perdu
        onBlur={handleEditEnd}
        // Permet de rendre la cellule directement éditable si on utilise contentEditable,
        // mais avec un input c'est plus contrôlable. Ici, on simule l'édition via un input.
      >
        {isEditing ? (
          <input
            type="text"
            value={cellValue}
            onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
            // Autofocus sur l'input quand il apparaît
            autoFocus
            // Gère l'événement de touche pour éviter la propagation si nécessaire,
            // et pour éventuellement sauvegarder avec une touche spéciale.
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditEnd();
              } else if (e.key === 'Escape') {
                // Annuler les changements (peut être implémenté en gardant la valeur initiale)
                handleEditEnd();
              }
            }}
          />
        ) : (
          cellValue
        )}
      </td>
    );
  };

  // Supprime une ligne
  const handleDeleteRow = (rowId) => {
    setData(data.filter(row => row.id !== rowId));
  };

  // Ajoute une nouvelle ligne vide
  const handleAddRow = () => {
    const newRowId = data.length > 0 ? Math.max(...data.map(row => row.id)) + 1 : 1;
    const newRow = { id: newRowId, ...Object.keys(initialData[0]).reduce((obj, key) => {
        if (key !== 'id') obj[key] = ''; // Initialise toutes les autres colonnes à vide
        return obj;
    }, {}) };
    setData([...data, newRow]);
  };

  // Les colonnes sont déduites des clés du premier objet de données (sauf 'id')
  const columns = initialData.length > 0
    ? Object.keys(initialData[0]).filter(key => key !== 'id').map(key => ({ id: key, name: key.charAt(0).toUpperCase() + key.slice(1) }))
    : [];

  return (
    <div className="editable-table-container">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.id}>{col.name}</th>
            ))}
            <th>Actions</th> {/* Colonne pour les boutons d'action */}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              {columns.map(col => renderCell(row, col))}
              <td className="action-cell">
                <button onClick={() => handleDeleteRow(row.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRow} className="add-row-button">Ajouter une ligne</button>
    </div>
  );
};

export default EditableTable;