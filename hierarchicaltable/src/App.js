import React, { useState } from 'react';
import TableRow from './Component/TableRow';
import './App.css';

const initialData = {
  rows: [
    {
      id: 'electronics',
      label: 'Electronics',
      value: 1500,
      originalValue: 1500,
      children: [
        {
          id: 'phones',
          label: 'Phones',
          value: 800,
          originalValue: 800,
        },
        {
          id: 'laptops',
          label: 'Laptops',
          value: 700,
          originalValue: 700,
        },
      ],
    },
    {
      id: 'furniture',
      label: 'Furniture',
      value: 1000,
      originalValue: 1000,
      children: [
        {
          id: 'tables',
          label: 'Tables',
          value: 400,
          originalValue: 300,
        },
        {
          id: 'chairs',
          label: 'Chairs',
          value: 700,
          originalValue: 700,
        },
      ],
    },
  ],
};

function App() {
  const [data, setData] = useState(initialData);

  return (
    <div>
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
            <TableRow key={row.id} row={row} setData={setData} data={data} allRows={data.rows} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
