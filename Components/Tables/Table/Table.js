import React from 'react';

const CustomTable = ({ data, columns, maxRows, renderAction }) => {
    const renderHeader = () => {
        return columns.map((col, index) => (
            <th key={index} scope="col" className="px-6 py-4 grid-row-header">
                {col.Header}
            </th>
        ));
    };

    const EmptyState = () => (
        <div className="w-full text-center py-12" style={{ marginTop: '50px' }}>
            <i className="fa-solid fa-face-frown-open mb-3" style={{ fontSize: '45px' }}></i>
            <p className="text-2xl text-gray-600 dark:text-gray-400">No items available</p>
        </div>
    );
    function formatDate(dateTimeString) {
        const date = new Date(dateTimeString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'submitted':
            case 'endorsed':
                return 'status submitted';
            case 'rejected':
            case 'reverted':
                return 'status rejected';
            case 'open':
                case 'completed':
                return 'status open';
            default:
                return 'status default';
        }
    };

    const renderRow = (item) => {
        return columns.map((col, index) => {
            const value = item[col.accessor];
                if (col.accessor === 'Status') {
                return (
                    <td key={index} className="whitespace-nowrap px-6 py-4 font-medium">
                        <span className={getStatusStyle(value)}>{value}</span>
                    </td>
                );
            }
            if (col.accessor === 'Date') {
                return (
                    <td key={index} className="whitespace-nowrap px-6 py-4 font-medium">
                        <span >{formatDate(value)}</span>
                    </td>
                );
            }
            
            if (col.customRender) {
                return (
                    <td key={index} className="whitespace-nowrap px-6 py-4 font-medium">
                        {col.customRender(value)}
                    </td>
                );
            }
            return (
                <td key={index} className="whitespace-nowrap px-6 py-4 font-medium">
                    <span>{value}</span>
                </td>
            );
        });
    };
    

    const displayedData = maxRows ? data.slice(0, maxRows) : data;

    return (
        <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                    {renderHeader()}
                    {renderAction && <th className="px-6 py-4 grid-row-header">Actions</th>} 
                </tr>
            </thead>
            <tbody>
                {displayedData.length > 0 ? (
                    displayedData.map((item, index) => (
                        <tr key={index} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                            {renderRow(item)}
                            {renderAction && <td className="whitespace-nowrap px-6 py-4 w-5">{renderAction(item)}</td>}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length + (renderAction ? 1 : 0)}>
                            <EmptyState />
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default CustomTable;
