# Getting Started with Create React Appsss

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


```
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import "../../../Styles/Styles_estadisticas/Inicio.css";
import "../../../Styles/Styles_estadisticas/mapaBo.css";
import Descargas from './Desgargas';

const PaginaFiltro = () => {
  const [chartData1, setChartData1] = useState({ labels: [], datasets: [] });
  const [chartData2, setChartData2] = useState({ labels: [], datasets: [] });
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [totalCases, setTotalCases] = useState(0);
  const [totalMunicipiosCases, setTotalMunicipiosCases] = useState(0);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('chart1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentsResponse = await axios.get('http://localhost:8000/api/departamentos');
        setDepartments(departmentsResponse.data);

        const casesResponse = await axios.get('http://localhost:8000/api/casos', { params: { order: 'asc' } });
        formatChartData1(casesResponse.data);

        const casesMunicipiosResponse = await axios.get('http://localhost:8000/api/casos/municipios', { params: { order: 'asc' } });
        formatChartData2(casesMunicipiosResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    try {
      const response = await axios.get(`http://localhost:8000/api/casos`, {
        params: { departamento_id: departmentId, order: 'asc' }
      });
      formatChartData1(response.data);

      const responseMunicipios = await axios.get(`http://localhost:8000/api/casos/municipios`, {
        params: { departamento_id: departmentId, order: 'asc' }
      });
      formatChartData2(responseMunicipios.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Error fetching data');
    }
  };

  const formatChartData1 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format');
      setError('Invalid data format');
      return;
    }

    const labels = data.map(item => item.departamento);
    const counts = data.map(item => item.cantidad_casos);
    const total = counts.reduce((acc, curr) => acc + curr, 0); // Total por departamento

    setTotalCases(total); // Guardar total de casos
    setChartData1({
      labels,
      datasets: [
        {
          label: 'Cantidad de Casos',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    });
  };

  const formatChartData2 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format');
      setError('Invalid data format');
      return;
    }

    const labels = data.map(item => `${item.departamento} - ${item.municipio}`);
    const counts = data.map(item => item.cantidad_de_casos);
    const total = counts.reduce((acc, curr) => acc + curr, 0); // Total por municipio

    setTotalMunicipiosCases(total); // Guardar total de casos por municipio
    setChartData2({
      labels,
      datasets: [
        {
          label: 'Cantidad de Casos por Municipio',
          data: counts,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    });
  };

  const renderTable = (chartData, type) => {
    return (
      <table className="data-table">
        <thead>
          <tr>
            {type === 'chart1' ? (
              <>
                <th>Departamento</th>
                <th>Cantidad de Casos</th>
              </>
            ) : (
              <>
                <th>Departamento - Municipio</th>
                <th>Cantidad de Casos</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {chartData.labels.map((label, index) => (
            <tr key={index}>
              <td>{label}</td>
              <td>{chartData.datasets[0].data[index]}</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total</strong></td>
            <td><strong>{type === 'chart1' ? totalCases : totalMunicipiosCases}</strong></td>
          </tr>
        </tbody>
      </table>
    );
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="fondo_Dinamica">
      <div className="letra">DINÁMICAS</div>
      <div className="contenedor_principal">
        <div className="card-header bg-dorado d-flex align-items-center" role="tab">
          <h3 className="font-weight-bold mb-0"><i className="fa fa-filter"></i> Filtrar Resultado de casos y resoluciones</h3>
          <a href="/Inicio" className="btn btn-outline-dark font-weight-bold ml-auto">
            <i className="fa fa-arrow-left"></i> Atrás
          </a>
        </div>
       
        <select onChange={handleDepartmentChange} value={selectedDepartment} className="select-departamento">
          <option value=''>Todos los departamentos</option>
          {departments.map(department => (
            <option key={department.id} value={department.id}>{department.nombre}</option>
          ))}
        </select>

        <div className="view-toggle">
          <button id='GraficoDatos' onClick={() => setViewType('chart1')} className={viewType === 'chart1' ? 'active' : ''}>Gráfica 1</button>
          <button id='GraficoDatos2' onClick={() => setViewType('chart2')} className={viewType === 'chart2' ? 'active' : ''}>Gráfica 2</button>
          <button id='TablaDatos' onClick={() => setViewType('table')} className={viewType === 'table' ? 'active' : ''}>Tabla</button>
        </div>

        <div className="contenedor-dinamico-cuadro">
          <Descargas targetId="contenedor-dinamico" />
        </div>
        
        <div className="contenedor-dinamico-cuadro">
          {viewType === 'chart1' ? (
            <>
              <div className="chart-container">
                <Bar data={chartData1} />
              </div>
              {renderTable(chartData1, 'chart1')}
            </>
          ) : viewType === 'chart2' ? (
            <>
              <div className="chart-container">
                <Bar data={chartData2} />
              </div>
              {renderTable(chartData2, 'chart2')}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PaginaFiltro;


```


```
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import "../../../Styles/Styles_estadisticas/Inicio.css";
import "../..Styles_estadisticas/mapaBo.css";
import Descargas from './Desgargas';

const PaginaFiltro = () => {
  const [chartData1, setChartData1] = useState({ labels: [], datasets: [] });
  const [chartData2, setChartData2] = useState({ labels: [], datasets: [] });
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [totalCases, setTotalCases] = useState(0);
  const [totalMunicipiosCases, setTotalMunicipiosCases] = useState(0);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('chart1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentsResponse = await axios.get('http://localhost:8000/api/departamentos');
        setDepartments(departmentsResponse.data);

        const casesResponse = await axios.get('http://localhost:8000/api/casos', { params: { order: 'asc' } });
        formatChartData1(casesResponse.data);

        const casesMunicipiosResponse = await axios.get('http://localhost:8000/api/casos/municipios', { params: { order: 'asc' } });
        formatChartData2(casesMunicipiosResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    try {
      const response = await axios.get(`http://localhost:8000/api/casos`, {
        params: { departamento_id: departmentId, order: 'asc' }
      });
      formatChartData1(response.data);

      const responseMunicipios = await axios.get(`http://localhost:8000/api/casos/municipios`, {
        params: { departamento_id: departmentId, order: 'asc' }
      });
      formatChartData2(responseMunicipios.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Error fetching data');
    }
  };

  const formatChartData1 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format');
      setError('Invalid data format');
      return;
    }

    const labels = data.map(item => item.departamento);
    const counts = data.map(item => item.cantidad_casos);
    const total = counts.reduce((acc, curr) => acc + curr, 0); // Total por departamento

    setTotalCases(total); // Guardar total de casos
    setChartData1({
      labels,
      datasets: [
        {
          label: 'Cantidad de Casos',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    });
  };

  const formatChartData2 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format');
      setError('Invalid data format');
      return;
    }

    const labels = data.map(item => `${item.departamento} - ${item.municipio}`);
    const counts = data.map(item => item.cantidad_de_casos);
    const total = counts.reduce((acc, curr) => acc + curr, 0); // Total por municipio

    setTotalMunicipiosCases(total); // Guardar total de casos por municipio
    setChartData2({
      labels,
      datasets: [
        {
          label: 'Cantidad de Casos por Municipio',
          data: counts,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    });
  };

  const renderTable = (chartData, type) => {
    return (
      <table className="data-table">
        <thead>
          <tr>
            {type === 'chart1' ? (
              <>
                <th>Departamento</th>
                <th>Cantidad de Casos</th>
              </>
            ) : (
              <>
                <th>Departamento - Municipio</th>
                <th>Cantidad de Casos</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {chartData.labels.map((label, index) => (
            <tr key={index}>
              <td>{label}</td>
              <td>{chartData.datasets[0].data[index]}</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total</strong></td>
            <td><strong>{type === 'chart1' ? totalCases : totalMunicipiosCases}</strong></td>
          </tr>
        </tbody>
      </table>
    );
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="fondo_Dinamica">
      <div className="letra">DINÁMICAS</div>
      <div className="contenedor_principal">
        <div className="card-header bg-dorado d-flex align-items-center" role="tab">
          <h3 className="font-weight-bold mb-0"><i className="fa fa-filter"></i> Filtrar Resultado de casos y resoluciones</h3>
          <a href="/Inicio" className="btn btn-outline-dark font-weight-bold ml-auto">
            <i className="fa fa-arrow-left"></i> Atrás
          </a>
        </div>
  
        <select onChange={handleDepartmentChange} value={selectedDepartment} className="select-departamento">
          <option value=''>Todos los departamentos</option>
          {departments.map(department => (
            <option key={department.id} value={department.id}>{department.nombre}</option>
          ))}
        </select>
  
        <div className="view-toggle">
          <button id='GraficoDatos' onClick={() => setViewType('chart1')} className={viewType === 'chart1' ? 'active' : ''}>Gráfica 1</button>
          <button id='GraficoDatos2' onClick={() => setViewType('chart2')} className={viewType === 'chart2' ? 'active' : ''}>Gráfica 2</button>
          <button id='TablaDatos' onClick={() => setViewType('table')} className={viewType === 'table' ? 'active' : ''}>Tabla</button>
        </div>
  
        <div className="contenedor-dinamico-cuadro">
          <Descargas targetId="contenedor-dinamico" />
        </div>
        
        <div className="contenedor-dinamico-cuadro">
          {viewType === 'chart1' ? (
            <div className="chart-container">
              <Bar data={chartData1} />
              <p className="chart-description">
              "Este gráfico presenta la cantidad total de casos reportados por departamento, ofreciendo una 
               representación visual que permite identificar rápidamente cuáles son las áreas con mayor incidencia
               de casos"
              </p>
            </div>
          ) : viewType === 'chart2' ? (
            <div className="chart-container">
              <Bar data={chartData2} />
              <p className="chart-description">
              "Este gráfico detalla la cantidad de casos reportados a nivel municipal, proporcionando un 
               análisis granular que permite evaluar la situación sanitaria en cada municipio. 
              </p>
            </div>
          ) : (
            <>
              {renderTable(chartData1, 'chart1')}
              {renderTable(chartData2, 'chart2')}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaFiltro;


```