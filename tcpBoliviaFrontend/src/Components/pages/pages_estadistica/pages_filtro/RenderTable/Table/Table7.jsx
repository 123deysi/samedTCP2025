import React from 'react'
import { DownloadExcelsButton } from './DownloadExcelsButton'

const Table7 = ({ headers, chartData }) => {
    return (
        <>
            <button
                className="download-button"
                onClick={() => DownloadExcelsButton(headers, chartData.labels, chartData.datasets, 'chart7_data')}
            >
                Descargar Excel
            </button>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Año - Mes</th>
                        {chartData.datasets.map(dataset => (
                            <th key={dataset.label}>{dataset.label}</th>
                        ))}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {chartData.labels.map((label, index) => (
                        <tr key={index}>
                            <td>{label}</td>
                            {chartData.datasets.map((dataset) => (
                                <td key={dataset.label}>
                                    {dataset.data[index] ?? 0}
                                </td>
                            ))}
                            <td>
                                <strong>
                                    {chartData.datasets.reduce((total, dataset) => total + (dataset.data[index] || 0), 0)}
                                </strong>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td><strong>Total</strong></td>
                        {chartData.datasets.map((dataset) => (
                            <td key={dataset.label}>
                                <strong>
                                    {dataset.data.reduce((acc, curr) => acc + curr, 0) ?? 0}
                                </strong>
                            </td>
                        ))}
                        <td>
                            <strong>
                                {chartData.datasets.reduce((total, dataset) => total + dataset.data.reduce((acc, curr) => acc + curr, 0), 0)}
                            </strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default Table7