import { usePagination, useTable } from 'react-table'

import './Table.css'

interface InputParamsInterface {
  data: any[]
  createRow: (row: any) => JSX.Element
  createdColumns: {
    Header: string
    accessor: string
  }[]
  pageSize: number
}

const Table = ({
  data,
  createRow,
  createdColumns,
  pageSize,
}: InputParamsInterface) => {
  const columns = createdColumns

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize } },
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
  } = tableInstance

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {data.length > 0 &&
            headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, idx) => (
                  <th className={`hd${idx}`} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row)
            return createRow(row)
          })}
        </tbody>
      </table>
      {data.length > 0 && (
        <div className="pagination zoom-bottom">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>{' '}
          <span style={{ marginLeft: '1em' }}>
            Page{' '}
            <strong>
              {tableInstance.state.pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
        </div>
      )}
    </>
  )
}

export default Table
