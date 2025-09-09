import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

function BasicTable() {
  const data = useMemo(
    () => [
      { id: 1, firstName: 'John', lastName: 'Doe', age: 30, status: 'Actif' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', age: 25, status: 'Inactif' },
      { id: 3, firstName: 'Peter', lastName: 'Jones', age: 40, status: 'Actif' },
      { id: 4, firstName: 'Mary', lastName: 'Williams', age: 35, status: 'En attente' },
      { id: 5, firstName: 'Louis', lastName: 'Dubois', age: 28, status: 'Actif' },
      { id: 6, firstName: 'Sophie', lastName: 'Durand', age: 32, status: 'Inactif' },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (props) => <span className="font-mono text-sm">{props.getValue()}</span>,
        enableSorting: true,
      },
      {
        accessorKey: 'firstName',
        header: 'Prénom',
        cell: (props) => <span className="font-semibold">{props.getValue()}</span>,
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
        cell: (props) => <span className="text-gray-600">{props.getValue()} ans</span>,
        enableSorting: true,
      },
      {
        accessorKey: 'status',
        header: 'Statut',
        enableSorting: true,
        cell: (props) => {
          const status = props.getValue();
          let badgeClass = '';
          switch (status) {
            case 'Actif':
              badgeClass = 'badge-success';
              break;
            case 'Inactif':
              badgeClass = 'badge-error';
              break;
            case 'En attente':
              badgeClass = 'badge-warning';
              break;
            default:
              badgeClass = 'badge-info';
          }
          return <div className={`badge ${badgeClass}`}>{status}</div>;
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
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Tableau des Utilisateurs (TanStack Table + DaisyUI)
        </h3>

        {/* Section pour le filtrage global */}
        <div className="mb-6 flex justify-between items-center">
          <label className="input input-bordered flex items-center gap-2 max-w-xs">
            <input
              type="text"
              className="grow"
              placeholder="Filtrer tout..."
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.023A5.479 5.479 0 1 1 11.023 9.965a.75.75 0 0 1-.977.977ZM5.5 10.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <button className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Ajouter utilisateur
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full border border-gray-200 rounded-lg">
            {/* head */}
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`cursor-pointer select-none text-gray-700 font-medium whitespace-nowrap px-4 py-3 text-left ${
                        header.column.getCanSort() ? 'hover:bg-gray-200 transition-colors' : ''
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
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {/* Footer optionnel, utile pour des totaux */}
            <tfoot>
              <tr>
                <td colSpan={columns.length} className="px-4 py-3 text-center text-gray-500 text-sm">
                  Nombre d'utilisateurs : {table.getFilteredRowModel().rows.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Indicateur si aucune donnée n'est trouvée */}
        {table.getFilteredRowModel().rows.length === 0 && (
          <p className="text-center text-gray-500 mt-4 p-4 border rounded-md bg-gray-50">
            Aucun résultat trouvé pour votre recherche.
          </p>
        )}
      </div>
    </div>
  );
}

export default BasicTable;