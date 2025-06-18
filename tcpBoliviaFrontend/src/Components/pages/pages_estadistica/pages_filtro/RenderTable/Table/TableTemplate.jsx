import React from 'react';
import { DownloadExcelButton } from './DownloadExcelButton';

const TableTemplate = ({ headers, chartData = {}, th1, th2, currentChart }) => {
    console.log(chartData)
    const labels = chartData.labels || [];
    const data = chartData.datasets?.[0]?.data || [];
    return (
        <>
            <button
                className="download-button"
                onClick={() =>
                    DownloadExcelButton(headers, labels, data, currentChart)
                }
            >
                Descargar Excel
            </button>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>{th1}</th>
                        <th>{th2}</th>
                    </tr>
                </thead>
                <tbody>
                    {labels.map((label, index) => (
                        <tr key={index}>
                            <td>{label}</td>
                            <td>{data[index] ?? 0}</td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <strong>Total</strong>
                        </td>
                        <td>
                            <strong>{data.reduce((acc, curr) => acc + curr, 0)}</strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default TableTemplate;