import React from 'react';

const SkeletonTable = ({ columns}) => {
  const renderSkeletonRows = (rowCount, cellCount) => {
    return [...Array(rowCount)].map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-row">
        {[...Array(cellCount)].map((_, colIndex) => (
          <div key={colIndex} className="skeleton-cell"></div>
        ))}
      </div>
    ));
  };

  return (
    <div className="skeleton-table p-4">
      <table className="min-w-full text-left text-sm font-light">
        <thead className="border-b font-medium dark:border-neutral-500">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className="px-6 py-4 grid-row-header">
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        </table>
          <div>{renderSkeletonRows(4, columns.length)}</div>
    </div>
  );
};

export default SkeletonTable;
