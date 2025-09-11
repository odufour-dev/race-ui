import React, { useMemo, useState } from 'react';
import './BasicTable.css';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';


function BasicTable({ data, setData }) {
  // Handler to delete a user row by id
  const handleDeleteUser = (id) => {
    setData(prev => prev.filter(user => user.id !== id));
  };

  // Handler to add a new user row
  const handleAddUser = () => {
    // Generate a new ID (max id + 1)
    const newId = data.length > 0 ? Math.max(...data.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      firstName: 'Nouvel',
      lastName: 'Utilisateur',
      age: 20,
      status: 'Actif',
    };
    setData(prev => [...prev, newUser]);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (props) => <span className="font-mono text-base text-blue-700">{props.getValue()}</span>,
        enableSorting: true,
      },
      {
        accessorKey: 'firstName',
        header: 'Prénom',
        cell: (props) => <span className="font-semibold text-blue-900">{props.getValue()}</span>,
        enableSorting: true,
      },
      {
        accessorKey: 'lastName',
        header: 'Nom',
        enableSorting: true,
      },
      {
        accessorKey: 'age',
        header: 'Âge',
        cell: (props) => <span className="text-blue-600">{props.getValue()} ans</span>,
        enableSorting: true,
      },
      {
        accessorKey: 'status',
        header: 'Statut',
        enableSorting: true,
        cell: (props) => {
          const status = props.getValue();
          let tailwindBadge = '';
          switch (status) {
            case 'Actif':
              tailwindBadge = 'bg-green-500 text-white';
              break;
            case 'Inactif':
              tailwindBadge = 'bg-red-500 text-white';
              break;
            case 'En attente':
              tailwindBadge = 'bg-yellow-400 text-gray-900';
              break;
            default:
              tailwindBadge = 'bg-blue-400 text-white';
          }
          return (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm min-w-[80px] justify-center ${tailwindBadge}`}
              style={{ lineHeight: '1.2', whiteSpace: 'nowrap' }}
            >
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
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
          <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md" onClick={handleAddUser}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Ajouter utilisateur
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-200 rounded-lg bg-white">
            {/* head */}
            <thead className="bg-blue-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`cursor-pointer select-none text-blue-900 font-semibold whitespace-nowrap px-4 py-3 text-left ${
                        header.column.getCanSort() ? 'hover:bg-blue-200 transition-colors' : ''
                      }`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {/* body */}
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="odd:bg-blue-50 even:bg-white hover:bg-blue-100 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-base text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <button
                      className="hover:bg-gray-200 rounded-full p-1 flex items-center justify-center transition-colors"
                      title="Supprimer la ligne"
                      style={{ width: '2rem', height: '2rem' }}
                      onClick={() => handleDeleteUser(row.original.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Footer optionnel, utile pour des totaux */}
            <tfoot>
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-3 text-center text-blue-700 text-base bg-blue-50">
                  Nombre d'utilisateurs : {table.getFilteredRowModel().rows.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Indicateur si aucune donnée n'est trouvée */}
        {table.getFilteredRowModel().rows.length === 0 && (
          <p className="text-center text-blue-700 mt-4 p-4 border rounded-md bg-blue-50">
            Aucun résultat trouvé pour votre recherche.
          </p>
        )}
      </div>
    </div>
  );
}

export default BasicTable;