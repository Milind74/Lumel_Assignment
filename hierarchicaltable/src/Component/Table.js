import React from 'react';
import TableRow from './TableRow';

function Table({ data, setData }) {
  const calculateGrandTotal = (rows) => {
    return rows.reduce((total, row) => {
      if (!row.children) {
        return total + row.value;
      } else {
        return total;
      }
    }, 0);
  };

  const grandTotal = calculateGrandTotal(data.rows);

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <TableRow key={row.id} row={row} setData={setData} data={data} />
          ))}
          <tr>
            <td>Grand Total</td>
            <td>{grandTotal.toFixed(2)}</td>
            <td colSpan="4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Table;
