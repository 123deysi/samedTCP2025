import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { 
  Button, Box, Typography, Table, TableBody, TableCell, 
  TableHead, TableRow, Paper, Container, Card, CardContent, 
  CardHeader, Divider, CircularProgress, Alert, Fade, 
  TableContainer, Chip, IconButton, Tooltip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  FilePresent as FileIcon,
  TableChart as TableChartIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const FormularioExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ show: false, message: '', type: 'info' });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const navigate = useNavigate();

  // Proteger el componente de usuarios no logeados
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
  
    if (!token || !storedUser) {
      navigate('/login');
    } else {
      setIsCheckingAuth(false);
    }
  }, [navigate]);
  
  if (isCheckingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#6c1b30' }} />
      </Box>
    );
  }

  // Manejo de archivos - procesar archivo seleccionado
  const processFile = (file) => {
    setSelectedFile(file);
    setIsFileUploaded(false);
    setUploadStatus({ show: false, message: '', type: 'info' });
    setLoading(true);

    if (file) {
      if (file.type.includes('csv')) {
        handleCSV(file);
      } else if (file.type.includes('sheet') || file.type.includes('excel')) {
        handleExcel(file);
      } else {
        setUploadStatus({
          show: true,
          message: 'Formato de archivo no soportado. Seleccione un archivo CSV o Excel.',
          type: 'error'
        });
        setLoading(false);
      }
    }
  };

  // Manejar el cambio de archivo por selección
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Manejar el drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Procesar archivo CSV
  const handleCSV = (file) => {
    Papa.parse(file, {
      complete: (results) => {
        console.log('CSV Data:', results.data);
        setFileData(results.data);
        setLoading(false);
        setUploadStatus({
          show: true,
          message: 'Archivo CSV cargado correctamente para previsualización',
          type: 'success'
        });
      },
      header: false,
      skipEmptyLines: true,
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setLoading(false);
        setUploadStatus({
          show: true,
          message: `Error al procesar el archivo CSV: ${error.message}`,
          type: 'error'
        });
      }
    });
  };

  // Procesar archivo Excel
  const handleExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log('Excel Data:', jsonData);
        setFileData(jsonData);
        setLoading(false);
        setUploadStatus({
          show: true,
          message: 'Archivo Excel cargado correctamente para previsualización',
          type: 'success'
        });
      } catch (error) {
        console.error('Error processing Excel file:', error);
        setLoading(false);
        setUploadStatus({
          show: true,
          message: `Error al procesar el archivo Excel: ${error.message}`,
          type: 'error'
        });
      }
    };
    reader.onerror = () => {
      setLoading(false);
      setUploadStatus({
        show: true,
        message: 'Error al leer el archivo',
        type: 'error'
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // Reiniciar el formulario
  const handleReset = () => {
    setSelectedFile(null);
    setFileData([]);
    setInputKey(Date.now());
    setUploadStatus({ show: false, message: '', type: 'info' });
  };

  // Enviar archivo a la base de datos
  const handleFileUpload = async () => {
    const token = localStorage.getItem('token'); 
    if (!selectedFile) {
      setUploadStatus({
        show: true,
        message: 'Por favor, selecciona un archivo primero.',
        type: 'warning'
      });
      return;
    }
  
    // Desactivar el botón mientras se sube el archivo
    setIsFileUploaded(true);
    setLoading(true);
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      setUploadStatus({
        show: true,
        message: 'Archivo subido exitosamente a la base de datos.',
        type: 'success'
      });
      console.log(response.data);
  
      // Limpiar campos después de la carga exitosa
      setTimeout(() => {
        setSelectedFile(null);
        setFileData([]);
        setInputKey(Date.now());
      }, 2000);
      
    } catch (error) {
      console.error('Error subiendo el archivo:', error);
      setUploadStatus({
        show: true,
        message: `Error al subir el archivo: ${error.response?.data?.error || error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
      setIsFileUploaded(false);
    }
  };

  // Determinar el tipo de archivo para la etiqueta
  const getFileType = () => {
    if (!selectedFile) return '';
    if (selectedFile.type.includes('csv')) return 'CSV';
    if (selectedFile.type.includes('sheet') || selectedFile.type.includes('excel')) return 'Excel';
    return 'Desconocido';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
        <CardHeader 
          title={
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#6c1b30' }}>
              <TableChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Importar datos desde archivo
            </Typography>
          }
          sx={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}
        />
        
        <CardContent>
          {/* Área de mensaje de estado */}
          {uploadStatus.show && (
            <Fade in={uploadStatus.show}>
              <Alert 
                severity={uploadStatus.type} 
                sx={{ mb: 3 }}
                action={
                  uploadStatus.type === 'success' && (
                    <IconButton 
                      size="small" 
                      color="inherit" 
                      onClick={() => setUploadStatus({ ...uploadStatus, show: false })}
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  )
                }
              >
                {uploadStatus.message}
              </Alert>
            </Fade>
          )}

          {/* Área de carga de archivos */}
          <Box 
            sx={{ 
              border: '2px dashed',
              borderColor: isDraggingOver ? '#6c1b30' : '#ccc',
              borderRadius: 2,
              p: 3, 
              mb: 3,
              textAlign: 'center',
              backgroundColor: isDraggingOver ? 'rgba(108, 27, 48, 0.05)' : '#f8f8f8',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#6c1b30',
                backgroundColor: 'rgba(108, 27, 48, 0.05)'
              }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              key={inputKey}
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".xls, .xlsx, .csv"
            />
            
            <CloudUploadIcon sx={{ fontSize: 60, color: '#6c1b30', mb: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              {selectedFile ? 'Archivo seleccionado' : 'Arrastra y suelta tu archivo aquí'}
            </Typography> 
            
            {selectedFile ? (
              <Box sx={{ mt: 2 }}>
                <Chip 
                  icon={<FileIcon />}
                  label={selectedFile.name}
                  variant="outlined"
                  color="primary"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  label={getFileType()}
                  color="secondary"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                  label={`${(selectedFile.size / 1024).toFixed(2)} KB`}
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              </Box>
            ) : (
              <Typography color="textSecondary" variant="body2">
                o haz clic para seleccionar un archivo CSV 
              </Typography>
            )}
          </Box>

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Tooltip title="Reiniciar formulario">
              <span>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                  disabled={loading || !selectedFile}
                >
                  Limpiar
                </Button>
              </span>
            </Tooltip>
            
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              onClick={handleFileUpload}
              disabled={!selectedFile || isFileUploaded || loading}
              sx={{
                backgroundColor: '#6c1b30',
                '&:hover': {
                  backgroundColor: '#4a1b24',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(108, 27, 48, 0.5)',
                  color: 'white'
                }
              }}
            >
              {loading ? 'Procesando...' : isFileUploaded ? 'Subido' : 'Subir a base de datos'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Vista previa de datos */}
      {fileData.length > 0 && (
        <Fade in={fileData.length > 0}>
          <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TableChartIcon sx={{ mr: 1, color: '#6c1b30' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Vista previa del archivo
                  </Typography>
                </Box>
              }
              subheader={selectedFile && `${selectedFile.name} - ${fileData.length} filas`}
              sx={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}
            />
            
            <Divider />
            
            <CardContent sx={{ p: 0 }}>
              <TableContainer 
                component={Paper} 
                elevation={0}
                sx={{ 
                  maxHeight: 400,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#bbb',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {fileData[0]?.map((col, index) => (
                        <TableCell
                          key={`header-${index}`}
                          sx={{
                            backgroundColor: '#6c1b30',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRight: index < fileData[0].length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                            whiteSpace: 'nowrap',
                            minWidth: '150px'
                          }}
                        >
                          {col || `Columna ${index + 1}`}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
  {fileData.slice(1, 501).map((row, rowIndex) => (
    <TableRow
      key={`row-${rowIndex}`}
      sx={{ 
        '&:nth-of-type(even)': { backgroundColor: '#f9f9f9' },
        '&:hover': { backgroundColor: '#f0f0f0' },
        transition: 'background-color 0.2s ease'
      }}
    >
      {row.map((cell, cellIndex) => (
        <TableCell
          key={`cell-${rowIndex}-${cellIndex}`}
          sx={{ 
            borderRight: cellIndex < row.length - 1 ? '1px solid #eee' : 'none',
            padding: '8px 16px'
          }}
        >
          {cell === null || cell === undefined ? '-' : String(cell)}
        </TableCell>
      ))}
      {/* Rellenar celdas faltantes si la fila tiene menos columnas que los encabezados */}
      {fileData[0] && row.length < fileData[0].length && (
        Array(fileData[0].length - row.length).fill('').map((_, i) => (
          <TableCell key={`empty-${rowIndex}-${i}`} sx={{ borderRight: i < fileData[0].length - row.length - 1 ? '1px solid #eee' : 'none' }}>
            -
          </TableCell>
        ))
      )}
    </TableRow>
  ))}

  {/* Si solo hay encabezado y nada más */}
  {fileData.length === 1 && (
    <TableRow>
      <TableCell 
        colSpan={fileData[0]?.length || 1} 
        sx={{ textAlign: 'center', padding: '20px' }}
      >
        <Typography 
          color="textSecondary" 
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <WarningIcon sx={{ mr: 1, color: '#f57c00' }} />
          No se encontraron datos para mostrar en el archivo.
        </Typography>
      </TableCell>
    </TableRow>
  )}
</TableBody>

                </Table>
              </TableContainer>
              
             {fileData.length > 501 && (
  <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid #eee' }}>
    <Typography variant="body2" color="textSecondary">
      Mostrando solo las primeras 500 filas para previsualización. El archivo completo será procesado al subir.
    </Typography>
  </Box>
)}

            </CardContent>
          </Card>
        </Fade>
      )}
    </Container>
  );
};

export default FormularioExcel;