import React, { useState, useEffect } from 'react';

function TableRow({ row, setData, data }) {
  const [inputValue, setInputValue] = useState('');

  const calculateVariance = (original, updated) => {
    return ((updated - original) / original * 100).toFixed(2);
  };

  const findOriginalValue = (id, rows) => {
    for (const row of rows) {
      if (row.id === id) {
        return row.originalValue !== undefined ? row.originalValue : row.value;
      }
      if (row.children) {
        const originalValue = findOriginalValue(id, row.children);
        if (originalValue !== undefined) {
          return originalValue;
        }
      }
    }
    return undefined;
  };

  const updateValue = (id, newValue, isDirectUpdate = true) => {
    const updateRowValue = (rows) => {
      return rows.map(row => {
        if (row.id === id) {
          const originalValue = isDirectUpdate ? row.value : row.originalValue;
          return { ...row, value: newValue, originalValue: originalValue || row.value };
        } else if (row.children) {
          return { ...row, children: updateRowValue(row.children) };
        }
        return row;
      });
    };
    setData(prevData => ({ ...prevData, rows: updateRowValue(prevData.rows) }));
  };

  const handlePercentageAllocation = () => {
    const percentage = parseFloat(inputValue);
    if (!isNaN(percentage)) {
      const newValue = row.value + (row.value * (percentage / 100));
      updateValue(row.id, newValue);
      setInputValue(''); // Reset input field after allocation
      propagateChildChanges(row.id, newValue); // Propagate changes to children
    }
  };

  const propagateChildChanges = (parentId, newValue) => {
    const parentRow = data.rows.find(row => row.id === parentId);
    if (parentRow && parentRow.children) {
      const totalChildValue = parentRow.children.reduce((total, child) => total + child.value, 0);
      parentRow.children.forEach(child => {
        const childContribution = child.value / totalChildValue;
        const updatedChildValue = newValue * childContribution;
        updateValue(child.id, updatedChildValue, false);
      });
    }
  };

  const handleValueAllocation = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      if (row.children) {
        handleSubtotalChange(value);
      } else {
        updateValue(row.id, value);
        setInputValue(''); // Reset input field after allocation
      }
    }
  };

  const handleSubtotalChange = (newValue) => {
    const totalChildValue = row.children.reduce((total, child) => total + child.value, 0);
    row.children.forEach(child => {
      const childContribution = child.value / totalChildValue;
      const updatedChildValue = newValue * childContribution;
      updateValue(child.id, updatedChildValue, false);
    });
    updateValue(row.id, newValue);
    setInputValue(''); // Reset input field after allocation
  };

  const updateParentValues = (rows) => {
    const updatedRows = rows.map(r => {
      if (r.children && r.children.some(child => child.id === row.id)) {
        const newValue = r.children.reduce((sum, child) => sum + child.value, 0);
        const originalValue = findOriginalValue(r.id, data.rows);
        return {
          ...r,
          value: newValue,
          originalValue: originalValue || r.value,
          variance: calculateVariance(originalValue || r.value, newValue),
        };
      }
      if (r.children) {
        return { ...r, children: updateParentValues(r.children) };
      }
      return r;
    });
    return updatedRows;
  };

  useEffect(() => {
    const newData = { ...data, rows: updateParentValues(data.rows) };
    setData(newData);
  }, [row.value]);

  useEffect(() => {
    if (row.children) {
      const total = row.children.reduce((sum, child) => sum + child.value, 0);
      if (total !== row.value) {
        updateValue(row.id, total, false);
      }
    }
  }, [row.children]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Validate input to allow only numbers and handle empty input
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setInputValue(value);
    }
  };

  return (
    <>
      <tr>
        <td>{row.label}</td>
        <td>{row.value.toFixed(2)}</td>
        <td>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
        </td>
        <td>
          <button onClick={handlePercentageAllocation}>%</button>
        </td>
        <td>
          <button onClick={handleValueAllocation}>Val</button>
        </td>
        <td>{calculateVariance(row.originalValue || row.value, row.value)}%</td>
      </tr>
      {row.children && row.children.map((child) => (
        <TableRow key={child.id} row={child} setData={setData} data={data} />
      ))}
    </>
  );
}

export default TableRow;
