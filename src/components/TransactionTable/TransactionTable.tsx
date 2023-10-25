import { useMemo } from 'react'
import { useTable, usePagination } from 'react-table'
import './TransactionTable.css'
import { ExternalLink } from 'react-external-link'
import TruncateText from '../TruncateText/TruncateText'

const TransactionTable = ({ data }: { data: any[] }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Transaction ID',
        accessor: 'id',
      },
    ],
    []
  )

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 4 } },
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
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      <ExternalLink
                        href={`https://explorer.aleo.org/transaction/${cell.value}`}
                        className="ext-link"
                      >
                        {/* {cell.render("Cell")} */}
                        <TruncateText text={cell.value} limit={30} />
                      </ExternalLink>
                    </td>
                  )
                })}
              </tr>
            )
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
          <span>
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

export default TransactionTable
