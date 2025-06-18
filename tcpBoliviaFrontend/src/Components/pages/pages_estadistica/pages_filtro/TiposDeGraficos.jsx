const TiposDeGraficos = ({ viewType, chartType, setChartType, setCurrentChart }) => {
    return (
        <>
            {viewType === 'chart' ? (
                <select
                    onChange={(e) => {
                        setChartType(e.target.value);
                        setCurrentChart(prev => prev); // Forzar actualización del gráfico
                    }}
                    value={chartType}
                    className="bg-slate-100 p-3"
                >
                    <option value="bar">Gráfico de Barras</option>
                    <option value="line">Gráfico de Líneas</option>
                    <option value="pie">Gráfico Circular</option>
                </select>
            ) : null}
        </>
    )
};

export default TiposDeGraficos