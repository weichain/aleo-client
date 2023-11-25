import { useCallback, useEffect, useMemo } from 'react'
import { Row, useExpanded, usePagination, useTable } from 'react-table'

import './Table.css'

interface InputParamsInterface {
  data: any[]
  createRow: (row: Row) => JSX.Element
  createdColumns: {
    Header: string
    accessor: string
  }[]
  pageSize: number
  getPageIndex?: (pageIndex: number) => void
}

const Table = ({
  data,
  createRow,
  createdColumns,
  pageSize,
  getPageIndex,
}: InputParamsInterface) => {
  const columns = useMemo(
    () => createdColumns,
    [JSON.stringify(createdColumns)]
  )
  const tableData = useMemo(() => data, [JSON.stringify(data)])

  const memoizedCreateRow = useCallback(createRow, [createRow])

  const tableInstance = useTable(
    { columns, data: tableData, initialState: { pageIndex: 0, pageSize } },
    useExpanded,
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
    state: { pageIndex },
  } = tableInstance

  useEffect(() => {
    getPageIndex && getPageIndex(pageIndex)
  }, [getPageIndex, pageIndex])

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
            return memoizedCreateRow(row) // Use the memoized function here
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
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
        </div>
      )}
    </>
  )
}

export default Table
