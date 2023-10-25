import { useMemo } from "react";
import { useTable } from "react-table";
import './TransactionTable.css'; // import the CSS file
import { ExternalLink } from "react-external-link";
import TruncateText from "../TruncateText/TruncateText";

// Define a new component for the table logic and generation
const TransactionTable = ({ data }: {data: any[]}) => {
    // Define the columns for the table
    const columns = useMemo(
      () => [
        {
          Header: "Transaction ID",
          accessor: "id", // accessor is the "key" in the data
        },
      ],
      []
    );
  
    // Create a table instance
    const tableInstance = useTable({ columns, data });
  
    // Destructure the table instance to get the props and methods
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      tableInstance;
  
    return (
      // Apply the table props
      <table {...getTableProps()}>
        <thead>
          {/* Loop over the header rows */}
          {headerGroups.map((headerGroup) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()}>
              {/* Loop over the headers in each row */}
              {headerGroup.headers.map((column, idx) => (
                // Apply the header cell props
                <th className={`hd${idx}`} {...column.getHeaderProps()}>
                  {/* Render the header */}
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {/* Loop over the table rows */}
          {rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {/* Loop over the rows cells */}
                {row.cells.map((cell) => {
                  // Apply the cell props
                  return (
                    <td {...cell.getCellProps()}>
                      {/* Render the cell content */}
                      <ExternalLink href={`https://explorer.aleo.org/transaction/${cell.value}`} className="ext-link">
                            {/* {cell.render("Cell")} */}
                        <TruncateText text={cell.value} limit={30} />
                      </ExternalLink>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  export default TransactionTable;