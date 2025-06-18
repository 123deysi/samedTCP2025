<?php

use App\Http\Controllers\Api\ResEmisorController;
use App\Http\Controllers\Api\AccionConstitucionalController;
use App\Http\Controllers\Api\CasoController;
use App\Http\Controllers\Api\ResolucionController;
use App\Http\Controllers\Api\DepartamentoController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\SubtipoAccionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\DatosInicialesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ExcelController;

// ruta nueva
use App\Http\Controllers\Api\EstadisticasController;
use App\Http\Controllers\Api\MultiplesController;

use Illuminate\Support\Facades\Route;


Route::get('/casos', [CasoController::class, 'casosPorDepartamento']);
Route::get('/departamentos', [DepartamentoController::class, 'showDepartamentos']);
Route::get('/casos/municipios', [CasoController::class, 'casosPorDepartamentoYMunicipio']);

Route::get('/resoluciones/departamento-tipo', [CasoController::class, 'resolucionesPorDepartamentoYTipo']);
Route::get('/resoluciones/tipo', [CasoController::class, 'resolucionesPorTipo2']);


Route::get('/resoluciones/por-fecha', [ResolucionController::class, 'resolucionesPorFecha']);
Route::get('/casos/por-fecha', [CasoController::class, 'casosPorFechaIngreso']);

Route::get('/resoluciones/por-accion-constitucional', [ResolucionController::class, 'resolucionesPorAccionConstitucional']);
Route::get('/resoluciones/accion-const', [ResolucionController::class, 'resolucionesPorAccionConst']);
Route::get('/acciones-constitucionales', [ResolucionController::class, 'accionesConstitucionales']);

Route::get('/unicoGestion', [CasoController::class, 'obtenerAniosUnicos']);
//actualizacion 
Route::get('/casosPorPeriodo', [CasoController::class, 'casosPorPeriodo']);
Route::get('/casosPorResEmisor', [CasoController::class, 'contarCasosResEmisor']);
Route::get('/resEmisor', [ResEmisorController::class, 'showResEmisor']);
Route::get('/casosPorAnio', [CasoController::class, 'casosPorAnio']);

Route::get('/resolucionesPorAnio', [ResolucionController::class, 'resolucionesPorAnio']);
Route::get('/tiemposResolucion', [ResolucionController::class, 'obtenerTiemposDeResolucion']);
Route::get('/resolucionPorResFondo', [ResolucionController::class, 'resolucionesPorFondo']);
Route::get('/resolucionesPorRelator', [ResolucionController::class, 'resolucionesPorRelator']);




Route::get('/accionConstitucional', [AccionConstitucionalController::class, 'showAccionConstitucional']);
Route::get('/lista/Casos', [CasoController::class, 'todosLosAtributos']);
Route::get('/obtenerDatosIniciales', [DatosInicialesController::class, 'obtenerDatosIniciales']);
Route::get('/contarCasos', [CasoController::class, 'contarCasos']);
Route::post('/login', [AuthController::class, 'login']);
//Proteccion por token
Route::middleware(['auth:sanctum'])->group(function () {
    //Proteccion por roles solo para Administrador
    Route::middleware(['role:Administrador'])->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/register', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        // Ruta para obtener los roles
        Route::get('/roles', [RoleController::class, 'index']);
    });
    //Proteccion por roles solo para Auxiliar
    Route::middleware(['role:Auxiliar'])->group(function () {
        // Route::get('/pruebas', [PruebaController::class, 'index']); Solo RUTAS PARA EL AUXILIAR
    });
    //si se coloca afuera de estos protectores no tendra restriccion por roles
     //Rutas protejidas solo por token y no por roles
     Route::post('/logout', [AuthController::class, 'logout']);
     Route::post('/upload', [ExcelController::class, 'upload']);
});
//estadistica de total casos y causas resueltos 
Route::get('/contar/casos/resoluciones', [CasoController::class, 'contarCasosYResoluciones']);
Route::get('resoluciones/departamento', [ResolucionController::class, 'resolucionesPorDepartamento']);





// rutas nuevas


Route::prefix('estadisticas')->group(function () {
    Route::get('/casos/por-departamento', [EstadisticasController::class, 'casosPorDepartamento']);

    Route::get('/casos/por-departamento-municipio', [EstadisticasController::class, 'casosPorDepartamentoYMunicipio']);


    Route::get('/casos/por-anio', [EstadisticasController::class, 'casosPorAnio']);


    Route::get('/resoluciones/por-fondo-voto', [EstadisticasController::class, 'resolucionesPorFondo']);

    Route::get('/tiempo-promedio-resolucion', [EstadisticasController::class, 'obtenerTiemposDeResolucion']);

    Route::get('/municipios', [EstadisticasController::class, 'obtenerMunicipios']);

    Route::get('/casos/por-res-emisor', [EstadisticasController::class, 'casosPorResEmisor']);

    Route::get('/tipos-resoluciones', [EstadisticasController::class, 'obtenerTiposResoluciones']);

    Route::get('/subtipos-acciones', [EstadisticasController::class, 'obtenerSubTiposAcciones']);

    Route::get('/acciones-constitucionales', [EstadisticasController::class, 'obtenerAccionesConstitucionales']);

    Route::get('/casos/por-accion-constitucional', [EstadisticasController::class, 'casosPorAccionConstitucional']);

    Route::get('/casos/por-subtipo-accion', [EstadisticasController::class, 'casosPorSubtipoAccion']);


    // graficos individuales por resoluciones

    Route::get('/resoluciones/por-fecha', [EstadisticasController::class, 'resolucionesPorFecha']);

    Route::get('/resoluciones/por-tipo', [EstadisticasController::class, 'resolucionesPorTipo']);

    Route::get('/tipos-resoluciones2', [EstadisticasController::class, 'obtenerTiposResoluciones2']);


    Route::get('/resoluciones/por-subtipo', [EstadisticasController::class, 'resolucionesPorSubtipo']);



    Route::get('/subtipos-resoluciones', [EstadisticasController::class, 'obtenerSubTiposResoluciones']);



    Route::get('/resoluciones/por-fondo-voto', [EstadisticasController::class, 'resolucionesPorFondoVoto']);

    Route::get('/resoluciones/lista-fondo-voto', [EstadisticasController::class, 'listaFondoVoto']);

    Route::get('/resoluciones/por-resresul', [EstadisticasController::class, 'resolucionesPorResResul']);

    Route::get('/resoluciones/lista-resresul', [EstadisticasController::class, 'listaResResul']);

    Route::get('/resoluciones/por-revresul', [EstadisticasController::class, 'resolucionesPorRevResul']);

    Route::get('/resoluciones/lista-revresul', [EstadisticasController::class, 'listaRevResul']);

    Route::get('/resoluciones/por-resfinal', [EstadisticasController::class, 'resolucionesPorResFinal']);

    Route::get('/resoluciones/lista-resfinal', [EstadisticasController::class, 'listaResFinal']);

    Route::get('/resoluciones/por-restiempo', [EstadisticasController::class, 'resolucionesPorResTiempo']);

    Route::get('/resoluciones/lista-restiempo', [EstadisticasController::class, 'listaResTiempo']);

    Route::get('/resoluciones/por-relator', [EstadisticasController::class, 'resolucionesPorRelator']);

    Route::get('/resoluciones/lista-relatores', [EstadisticasController::class, 'listaRelatores']);

    Route::get('/resoluciones/por-departamento', [EstadisticasController::class, 'resolucionesPorDepartamento']);

    Route::get('/resoluciones/lista-departamentos', [EstadisticasController::class, 'listaDepartamentos']);

    Route::get('/resoluciones/lista-municipios', [EstadisticasController::class, 'listaMunicipios']);

    Route::get('/resoluciones/lista-municipios-todos', [EstadisticasController::class, 'listaMunicipiosTodos']);

    Route::get('/resoluciones/acciones-constitucionales', [EstadisticasController::class, 'listaAccionesConstitucionales']);

    Route::get('/resoluciones/por-accion-constitucional', [EstadisticasController::class, 'resolucionesPorAccionConstitucional']);

    Route::get('/resoluciones/subtipos-acciones/{accionId}', [EstadisticasController::class, 'obtenerSubtiposAccionesResoluciones']);

    Route::get('/resoluciones/por-subtipo-accion', [EstadisticasController::class, 'resolucionesPorSubtipoAccion']);

    // graficos seleccion multiple de casos


    Route::get('/casos', [EstadisticasController::class, 'obtenerEstadisticasCasos']);

    Route::get('/casos-filtrados', [EstadisticasController::class, 'obtenerCasosFiltrados']);

    Route::get('/res-emisores', [EstadisticasController::class, 'obtenerResEmisores']);
    Route::get('/departamentos', [EstadisticasController::class, 'obtenerDepartamentos']);
    Route::get('/obtener-subtipos-acciones', [EstadisticasController::class, 'SubtiposAcciones']);
    // 

});

Route::prefix('multiples')->group(function () {

    Route::get('/lista-departamentos', [MultiplesController::class, 'listaDepartamentos']);

    Route::get('/lista-municipios', [MultiplesController::class, 'listaMunicipios']);

    Route::get('/lista-resemisor', [MultiplesController::class, 'listaResEmisor']);

    Route::get('/lista-fechas-ingreso', [MultiplesController::class, 'listaFechasIngreso']);

    Route::get('/lista-accion-constitucional', [MultiplesController::class, 'listaAccionConstitucional']);

    Route::get('/lista-subtipo-accion-constitucional', [MultiplesController::class, 'listaSubtipoAccionConstitucional']);


    Route::get('/casos/estadisticas', [MultiplesController::class, 'estadisticasCasos']);

    Route::get('/resoluciones/estadisticas', [MultiplesController::class, 'estadisticasResoluciones']);
});
