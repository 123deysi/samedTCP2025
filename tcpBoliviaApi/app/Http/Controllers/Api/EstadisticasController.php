<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EstadisticasController extends Controller
{
    // Casos por departamento
    public function casosPorDepartamento(Request $request)
    {
        $departamentosId = $request->query('departamentos_id');

        $query = DB::table('casos')
            ->join('departamentos', 'casos.departamento_id', '=', 'departamentos.id')
            ->select('departamentos.nombre as departamento', DB::raw('COUNT(casos.id) as cantidad_casos'))
            ->groupBy('departamentos.nombre');

        if (!empty($departamentosId)) {
            $query->whereIn('casos.departamento_id', explode(',', $departamentosId));
        }

        try {
            return response()->json($query->get());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }

    // Casos por municipio y departamento
    public function casosPorDepartamentoYMunicipio(Request $request)
    {
        try {
            $departamentoId = $request->query('departamento_id');
            $municipiosId = $request->query('municipios_id'); // Capturar municipios seleccionados

            $query = DB::table('casos as c')
                ->leftJoin('departamentos as d', 'c.departamento_id', '=', 'd.id')
                ->leftJoin('municipios as m', 'c.municipio_id', '=', 'm.id')
                ->select(
                    'm.id as municipio_id',
                    'd.nombre as departamento',
                    DB::raw("CASE 
                    WHEN m.nombre REGEXP '^Capital [0-9]+' THEN 'Capital'
                    ELSE m.nombre 
                END as municipio"),
                    DB::raw('COUNT(c.id) as cantidad_casos')
                )
                ->groupBy('m.id', 'd.nombre', 'municipio')
                ->whereNotNull('d.nombre')
                ->whereNotNull('m.nombre')
                ->whereNotNull('c.departamento_id') // Omitir valores null
                ->whereNotNull('c.municipio_id') // Omitir valores null
                ->whereNotIn('c.departamento_id', [97, 999]) // Omitir valores 97 y 999
                ->whereNotIn('c.municipio_id', [97, 999]) // Omitir valores 97 y 999
                ->orderBy('d.nombre')
                ->orderBy('municipio');

            //  Filtrar por departamento si se selecciona uno
            if (!empty($departamentoId)) {
                $query->where('c.departamento_id', $departamentoId);
            }

            //  Filtrar por municipios si se selecciona uno o más
            if (!empty($municipiosId)) {
                $municipiosArray = explode(',', $municipiosId);
                $query->whereIn('c.municipio_id', $municipiosArray);
            }

            $resultados = $query->get();

            return response()->json($resultados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }



    // Casos por año con filtros de año y mes correctamente aplicados
    public function casosPorAnio(Request $request)
    {
        try {
            $anio = $request->query('anio');
            $mes = $request->query('mes');

            $query = DB::table('casos')
                ->select(
                    DB::raw('YEAR(fecha_ingreso) AS anio'),
                    DB::raw('MONTH(fecha_ingreso) AS mes'),
                    DB::raw('COUNT(id) AS cantidad_casos')
                )
                ->whereNotNull('fecha_ingreso');

            //  Aplicar filtros si están presentes
            if ($anio) {
                $query->whereYear('fecha_ingreso', $anio);
            }
            if ($mes) {
                $query->whereMonth('fecha_ingreso', $mes);
            }

            //  Agrupar y ordenar los resultados
            $query->groupBy(DB::raw('YEAR(fecha_ingreso), MONTH(fecha_ingreso)'))
                ->orderBy('anio', 'asc')
                ->orderBy('mes', 'asc');

            $resultados = $query->get();

            //  Formatear los datos en una estructura más útil
            $datosAgrupados = [];
            foreach ($resultados as $fila) {
                $year = $fila->anio;
                $month = $fila->mes;

                // Si el año no existe en el array, lo inicializamos
                if (!isset($datosAgrupados[$year])) {
                    $datosAgrupados[$year] = array_fill(1, 12, 0); // Inicializar todos los meses con 0
                }

                // Asignar el valor del mes correspondiente
                $datosAgrupados[$year][$month] = $fila->cantidad_casos;
            }

            //  Convertir datos en formato JSON esperado
            $data = [];
            foreach ($datosAgrupados as $year => $meses) {
                foreach ($meses as $month => $count) {
                    $data[] = [
                        'anio' => $year,
                        'mes' => $month,
                        'cantidad_casos' => $count
                    ];
                }
            }

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }


    // Resoluciones por fondo de voto
    public function resolucionesPorFondo(Request $request)
    {
        try {
            $query = DB::table('resoluciones')
                ->select('res_fondo_voto', DB::raw('COUNT(id) as cantidad_resoluciones'))
                ->groupBy('res_fondo_voto')
                ->get();

            return response()->json($query);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }

    // Tiempo promedio de resolución por mes/año
    public function obtenerTiemposDeResolucion()
    {
        try {
            $query = DB::table('resoluciones')
                ->select(DB::raw('YEAR(res_fecha) AS anio'), DB::raw('MONTH(res_fecha) AS mes'), DB::raw('AVG(restiempo) AS tiempo_promedio'))
                ->groupBy(DB::raw('YEAR(res_fecha), MONTH(res_fecha)'))
                ->get();

            return response()->json($query);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }

    public function obtenerMunicipios()
    {
        try {
            // Obtener solo municipios que tienen casos registrados
            $municipios = DB::table('municipios as m')
                ->join('casos as c', 'm.id', '=', 'c.municipio_id')
                ->select('m.id', 'm.nombre as municipio', 'm.departamento_id', DB::raw('COUNT(c.id) as cantidad_casos'))
                ->groupBy('m.id', 'm.nombre', 'm.departamento_id')
                ->having('cantidad_casos', '>', 0) // Filtrar solo municipios con casos
                ->orderBy('m.nombre')
                ->get();

            return response()->json($municipios);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener municipios: ' . $e->getMessage()], 500);
        }
    }


    public function casosPorResEmisor(Request $request)
    {
        try {
            // Capturar parámetro de filtro (si existe)
            $resEmisorId = $request->query('res_emisor_id');

            $query = DB::table('casos as c')
                ->join('res_emisores as r', 'c.res_emisor_id', '=', 'r.id')
                ->select('r.id as res_emisor_id', 'r.nombre as res_emisor', 'r.descripcion as res_emisor_descripcion', DB::raw('COUNT(c.id) as cantidad_casos'))
                ->groupBy('r.id', 'r.nombre', 'r.descripcion') //  Se agrupa también por ID para evitar problemas
                ->orderBy('r.nombre', 'asc');

            //  Filtrar por res emisor si se selecciona uno
            if (!empty($resEmisorId)) {
                $query->where('c.res_emisor_id', $resEmisorId);
            }

            return response()->json($query->get());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }


    // Obtener Tipos de Resoluciones (Tipos Resoluciones 2)
    public function obtenerTiposResoluciones()
    {
        try {
            $tipos = DB::table('tipos_resoluciones2')
                ->select('id', 'descripcion')
                ->whereNotIn('codigo', [99, 97]) //  Omitir registros con código  99 y 97

                ->orderBy('descripcion', 'asc')
                ->get();

            return response()->json($tipos);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los tipos de resoluciones: ' . $e->getMessage()], 500);
        }
    }


    // Obtener Sub Tipos de Resoluciones
    public function obtenerSubTiposAcciones(Request $request)
    {
        try {
            // Capturar el ID de la acción constitucional si se ha filtrado
            $accionConstId = $request->query('accion_const_id');

            $query = DB::table('subtipos_acciones as sa')
                ->join('acciones_constitucionales as ac', 'sa.accion_id', '=', 'ac.id')
                ->leftJoin('casos as c', 'sa.id', '=', 'c.accion_const_id') // Relación correcta con `casos`
                ->select(
                    'sa.id as subtipo_id',
                    'sa.nombre as sub_tipo_nombre',
                    'sa.codigo as sub_tipo_codigo',
                    'ac.nombre as accion_const_nombre',
                    DB::raw('COUNT(c.id) as cantidad_casos') // Contamos los casos relacionados
                )
                ->groupBy('sa.id', 'sa.nombre', 'ac.nombre','sa.codigo')
                ->orderBy('ac.nombre', 'asc')
                ->orderBy('sa.nombre', 'asc');

            //  Aplicar filtro por acción constitucional si se proporciona
            if (!empty($accionConstId)) {
                $query->where('ac.id', $accionConstId);
            }

            $resultados = $query->get();

            //  Calcular el total de casos
            $totalCasos = $resultados->sum('cantidad_casos');

            return response()->json([
                'data' => $resultados,
                'total_casos' => $totalCasos, //  Total de casos correctos
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }



    public function casosPorSubtipoAccion(Request $request)
    {
        try {
            $subTipoNombre = $request->query('sub_tipo_accion');
            $accionConstId = $request->query('accion_const_id');

            $query = DB::table('subtipos_acciones as sa')
                ->join('acciones_constitucionales as ac', 'sa.accion_id', '=', 'ac.id')
                ->leftJoin('casos as c', 'sa.id', '=', 'c.accion_const_id') // Relación corregida con `casos`
                ->select(
                    'sa.id as subtipo_id',
                    'sa.nombre as sub_tipo_nombre',
                    'sa.codigo as sub_tipo_codigo',
                    'ac.nombre as accion_const_nombre',
                    DB::raw('COUNT(c.id) as cantidad_casos') // Contar correctamente los casos
                )
                ->groupBy('sa.id', 'sa.nombre', 'ac.nombre','sa.codigo')
                ->orderBy('ac.nombre', 'asc')
                ->orderBy('sa.nombre', 'asc');

            //  Aplicar filtro por subtipo de acción si se proporciona
            if (!empty($subTipoNombre)) {
                $query->where('sa.nombre', $subTipoNombre);
            }

            //  Aplicar filtro por acción constitucional si se proporciona
            if (!empty($accionConstId)) {
                $query->where('ac.id', $accionConstId);
            }

            $resultados = $query->get();

            //  Calcular el total de casos correctamente
            $totalCasos = $resultados->sum('cantidad_casos');

            return response()->json([
                'data' => $resultados,
                'total_casos' => $totalCasos, //  Total de casos corregido
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }



    public function obtenerAccionesConstitucionales()
    {
        try {
            $acciones = DB::table('acciones_constitucionales')
                ->select('id', 'nombre')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($acciones);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener las acciones constitucionales: ' . $e->getMessage()], 500);
        }
    }

    // Casos por tipo de acción constitucional
    public function casosPorAccionConstitucional(Request $request)
    {
        try {
            $accionConstId = $request->query('accion_const2_id');

            $query = DB::table('casos as c')
                ->join('acciones_constitucionales as ac', 'c.accion_const2_id', '=', 'ac.id')
                ->select(
                    'ac.nombre as accion_const_nombre',
                    DB::raw('COUNT(c.id) as cantidad_casos')
                )
                ->groupBy('ac.nombre')
                ->orderBy('ac.nombre', 'asc');

            if (!empty($accionConstId)) {
                $query->where('c.accion_const2_id', $accionConstId);
            }

            $resultados = $query->get();
            $totalCasos = $resultados->sum('cantidad_casos') ?? 0; // Evitar null

            return response()->json([
                'data' => $resultados,
                'total_casos' => $totalCasos
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }



    // **************************** resoluciones ****************************

    public function resolucionesPorFecha(Request $request)
    {
        try {
            $anio = $request->query('anio');
            $mes = $request->query('mes');

            //  Consulta Base SIN filtros para obtener todos los años y meses disponibles
            $query = DB::table('resoluciones')
                ->select(
                    DB::raw('YEAR(res_fecha) as anio'),
                    DB::raw('MONTH(res_fecha) as mes'),
                    DB::raw('COUNT(id) as cantidad_resoluciones')
                )
                ->whereNotNull('res_fecha')
                ->groupBy(DB::raw('YEAR(res_fecha), MONTH(res_fecha)'))
                ->orderBy(DB::raw('YEAR(res_fecha)'), 'asc')
                ->orderBy(DB::raw('MONTH(res_fecha)'), 'asc');

            //  Aplicar filtros SOLO SI hay selección de año o mes
            if (!empty($anio)) {
                $query = $query->clone()->whereYear('res_fecha', $anio);
            }

            if (!empty($mes)) {
                $query = $query->clone()->whereMonth('res_fecha', $mes);
            }

            $resultados = $query->get();

            if ($resultados->isEmpty()) {
                return response()->json([]); //  Si no hay datos, devolver un array vacío.
            }

            //  Agrupar los datos por año y meses
            $datosAgrupados = [];
            foreach ($resultados as $fila) {
                $year = $fila->anio;
                if (!isset($datosAgrupados[$year])) {
                    $datosAgrupados[$year] = array_fill(1, 12, 0); // Inicializar todos los meses en 0
                }
                $datosAgrupados[$year][$fila->mes] = $fila->cantidad_resoluciones;
            }

            $data = [];
            foreach ($datosAgrupados as $year => $meses) {
                $data[] = [
                    'anio' => $year,
                    'resoluciones_por_mes' => $meses
                ];
            }

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }



    public function resolucionesPorTipo(Request $request)
    {
        try {
            $anio = $request->query('anio');
            $mes = $request->query('mes');
            $tipoResolucion = $request->query('tipo_resolucion');

            //  Obtener los IDs de tipos_resoluciones2 válidos
            $validIds = DB::table('tipos_resoluciones2')
                ->whereNotNull('descripcion') // Excluir donde descripción es NULL
                ->whereNotIn('codigo', [97, 99, 999]) // Excluir códigos 97, 99 y 999
                ->pluck('id')
                ->toArray(); // Obtener los IDs en un array

            //  Contar resoluciones filtradas por los IDs obtenidos
            $query = DB::table('resoluciones as r')
                ->leftJoin('tipos_resoluciones2 as tr2', 'r.res_tipo2_id', '=', 'tr2.id')
                ->select(
                    DB::raw('COALESCE(tr2.descripcion, "Sin Tipo") as tipo_resolucion2'),
                    DB::raw('COUNT(r.id) as cantidad_resoluciones')
                )
                ->whereIn('r.res_tipo2_id', $validIds) // Filtrar resoluciones con IDs válidos
                ->groupBy('tr2.descripcion')
                ->orderBy('tr2.descripcion', 'asc');

            //  Aplicar filtros opcionales de año y mes
            if (!empty($anio)) {
                $query->whereYear('r.res_fecha', $anio);
            }
            if (!empty($mes)) {
                $query->whereMonth('r.res_fecha', $mes);
            }
            if (!empty($tipoResolucion)) {
                $query->where('tr2.id', $tipoResolucion);
            }

            $resultados = $query->get();

            return response()->json($resultados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }



    public function obtenerTiposResoluciones2()
    {
        try {
            $tiposResoluciones = DB::table('tipos_resoluciones as tr')
                ->join('tipos_resoluciones2 as tr2', 'tr.res_tipo2_id', '=', 'tr2.id')
                ->select(
                    'tr.descripcion as tipo_resolucion'
                )
                ->distinct()
                ->orderBy('tr.descripcion', 'asc')
                ->get();

            return response()->json($tiposResoluciones);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }


    public function obtenerSubTiposResoluciones()
    {
        try {
            $subtipos = DB::table('tipos_resoluciones')
                ->select('id', 'descripcion', 'res_tipo2_id')
                ->orderBy('descripcion', 'asc')
                ->get();

            return response()->json($subtipos);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los subtipos de resoluciones: ' . $e->getMessage()], 500);
        }
    }

    public function resolucionesPorSubtipo(Request $request)
    {
        try {
            $anio = $request->query('anio');
            $mes = $request->query('mes');
            $tipoResolucion = $request->query('tipo_resolucion'); // ID de `tipos_resoluciones2`
            $subTipoResolucion = $request->query('sub_tipo_resolucion'); // ID de `tipos_resoluciones`

            $query = DB::table('resoluciones as r')
                ->leftJoin('tipos_resoluciones as tr', 'r.res_tipo_id', '=', 'tr.id')
                ->leftJoin('tipos_resoluciones2 as tr2', 'r.res_tipo2_id', '=', 'tr2.id')
                ->select(
                    DB::raw('COALESCE(tr.descripcion, "Sin Subtipo") as sub_tipo_resolucion'),
                    DB::raw('COALESCE(tr2.descripcion, "Sin Tipo") as tipo_resolucion'),
                    DB::raw('COUNT(r.id) as cantidad_resoluciones')
                )
                ->whereNotNull('r.res_tipo_id')
                ->whereNotNull('r.res_tipo2_id')
                ->where('tr.descripcion', '!=', '') //  Excluir "Otro"
                ->groupBy('tr.descripcion', 'tr2.descripcion')
                ->orderBy('tr2.descripcion', 'asc');

            if (!empty($anio)) {
                $query->whereYear('r.res_fecha', $anio);
            }
            if (!empty($mes)) {
                $query->whereMonth('r.res_fecha', $mes);
            }
            if (!empty($tipoResolucion)) {
                $query->where('r.res_tipo2_id', $tipoResolucion);
            }
            if (!empty($subTipoResolucion)) {
                $query->where('r.res_tipo_id', $subTipoResolucion);
            }

            $resultados = $query->get();

            return response()->json($resultados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }



    public function resolucionesPorFondoVoto(Request $request)
    {
        try {
            $anio = $request->query('anio');
            $mes = $request->query('mes');
            $fondoVoto = $request->query('res_fondo_voto');

            $query = DB::table('resoluciones')
                ->select(
                    'res_fondo_voto',
                    DB::raw('COUNT(id) as cantidad_resoluciones')
                )
                ->whereNotIn('res_fondo_voto', ['97', '999']) // Evitar valores 97 y 999
                ->groupBy('res_fondo_voto')
                ->orderBy('res_fondo_voto', 'asc');

            if (!empty($anio)) {
                $query->whereYear('res_fecha', $anio);
            }
            if (!empty($mes)) {
                $query->whereMonth('res_fecha', $mes);
            }
            if (!empty($fondoVoto)) {
                $query->where('res_fondo_voto', $fondoVoto);
            }

            $resultados = $query->get();

            return response()->json($resultados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }


    public function listaFondoVoto()
    {
        try {
            $fondosVoto = DB::table('resoluciones')
                ->select('res_fondo_voto')
                ->distinct()
                ->whereNotIn('res_fondo_voto', ['97', '999']) //  Evitar valores 97 y 999
                ->orderBy('res_fondo_voto', 'asc')
                ->get();

            return response()->json($fondosVoto);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }

    public function resolucionesPorResResul(Request $request)
    {
        try {
            $resResul = $request->query('resresul');

            $query = DB::table('resoluciones')
                ->select(
                    'resresul',
                    DB::raw("
                        CASE 
                            WHEN resresul = 1 THEN 'Concede todo lo solicitado por el recurrente'
                            WHEN resresul = 2 THEN 'Deniega todo'
                            WHEN resresul = 3 THEN 'Parcial, concede en parte, deniega en parte'
                            ELSE 'Otro'
                        END as descripcion
                    "),
                    DB::raw('COUNT(id) as cantidad_resoluciones')
                )
                ->whereNotNull('resresul')
                ->groupBy('resresul')
                ->orderBy('resresul', 'asc');

            if (!empty($resResul)) {
                $query->where('resresul', $resResul);
            }

            $resultados = $query->get();

            return response()->json($resultados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }



    public function listaResResul()
    {
        try {
            $resResul = DB::table('resoluciones')
                ->select(
                    'resresul',
                    DB::raw("
                        CASE 
                            WHEN resresul = 1 THEN 'Concede todo lo solicitado por el recurrente'
                            WHEN resresul = 2 THEN 'Deniega todo'
                            WHEN resresul = 3 THEN 'Parcial, concede en parte, deniega en parte'
                            ELSE 'Otro'
                        END as descripcion
                    ")
                )
                ->whereNotNull('resresul')
                ->distinct()
                ->orderBy('resresul', 'asc')
                ->get();

            return response()->json($resResul);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }


    public function resolucionesPorRevResul(Request $request)
    {
        try {
            $revResul = $request->query('revresul');

            $query = DB::table('resoluciones')
                ->select(
                    'revresul',
                    DB::raw('COUNT(id) as cantidad_resoluciones')
                )
                ->whereNotNull('revresul')
                ->whereNotIn('revresul', [97, 99, 999]) //  Excluir valores inválidos
                ->groupBy('revresul')
                ->orderBy('revresul', 'asc');

            if (!empty($revResul)) {
                $query->where('revresul', $revResul);
            }

            $resultados = $query->get();

            //  Agregar descripciones de `revresul`
            $descripciones = [
                1 => "Confirma (aprueba) totalmente la decisión del tribunal",
                2 => "Revoca totalmente",
                3 => "Parcial, confirma en parte y revoca en parte",
                999 => "Duda en la clasificación"
            ];

            $resultadosTransformados = $resultados->map(function ($item) use ($descripciones) {
                return [
                    'revresul' => $item->revresul,
                    'descripcion' => $descripciones[$item->revresul] ?? "Otro",
                    'cantidad_resoluciones' => $item->cantidad_resoluciones
                ];
            });

            return response()->json($resultadosTransformados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }



    public function listaRevResul()
    {
        try {
            $revResul = DB::table('resoluciones')
                ->select('revresul')
                ->whereNotNull('revresul')
                ->distinct()
                ->orderBy('revresul', 'asc')
                ->get();

            return response()->json($revResul);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }

    public function resolucionesPorResFinal(Request $request)
    {
        try {
            $resFinal = $request->query('resfinal');

            $query = DB::table('resoluciones')
                ->select(
                    'resfinal',
                    DB::raw('COUNT(id) as cantidad_resoluciones')
                )
                ->whereNotNull('resfinal')
                ->whereNotIn('resfinal', [97, 99, 999]) //  Excluir valores inválidos
                ->groupBy('resfinal')
                ->orderBy('resfinal', 'asc');

            if (!empty($resFinal)) {
                $query->where('resfinal', $resFinal);
            }

            $resultados = $query->get();

            //  Agregar descripciones de `resfinal`
            $descripciones = [
                1 => "Concede todo lo solicitado por el recurrente",
                2 => "Deniega todo",
                3 => "Parcial, concede en parte, deniega en parte",
                999 => "Duda en la clasificación"
            ];

            $resultadosTransformados = $resultados->map(function ($item) use ($descripciones) {
                return [
                    'resfinal' => $item->resfinal,
                    'descripcion' => $descripciones[$item->resfinal] ?? "Otro",
                    'cantidad_resoluciones' => $item->cantidad_resoluciones
                ];
            });

            return response()->json($resultadosTransformados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }

    public function listaResFinal()
    {
        try {
            $resFinalList = DB::table('resoluciones')
                ->select('resfinal')
                ->whereNotNull('resfinal')
                ->whereNotIn('resfinal', [97, 99, 999]) //  Excluir valores inválidos
                ->distinct()
                ->orderBy('resfinal', 'asc')
                ->get();

            //  Agregar descripciones a `resfinal`
            $descripciones = [
                1 => "Concede todo lo solicitado por el recurrente",
                2 => "Deniega todo",
                3 => "Parcial, concede en parte, deniega en parte",
                999 => "Duda en la clasificación"
            ];

            $resFinalTransformado = $resFinalList->map(function ($item) use ($descripciones) {
                return [
                    'resfinal' => $item->resfinal,
                    'descripcion' => $descripciones[$item->resfinal] ?? "Otro"
                ];
            });

            return response()->json($resFinalTransformado);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }


    public function resolucionesPorResTiempo(Request $request)
    {
        try {
            $anio = $request->query('anio');
            $mes = $request->query('mes');
            $resTiempo = $request->query('restiempo');

            $query = DB::table('resoluciones')
                ->select(
                    'restiempo',
                    DB::raw('YEAR(res_fecha) as anio'),
                    DB::raw('MONTH(res_fecha) as mes'),
                    DB::raw('COUNT(id) as cantidad_resoluciones')
                )
                ->whereNotNull('restiempo')
                ->groupBy('restiempo', 'anio', 'mes')
                ->orderBy('anio', 'desc')
                ->orderBy('mes', 'asc');

            if (!empty($anio)) {
                $query->whereYear('res_fecha', $anio);
            }
            if (!empty($mes)) {
                $query->whereMonth('res_fecha', $mes);
            }
            if (!empty($resTiempo)) {
                $query->where('restiempo', $resTiempo);
            }

            $resultados = $query->get();

            return response()->json($resultados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }

    public function listaResTiempo()
    {
        try {
            $resTiempoList = DB::table('resoluciones')
                ->select('restiempo')
                ->whereNotNull('restiempo')
                ->distinct()
                ->orderBy('restiempo', 'asc')
                ->get();

            return response()->json($resTiempoList);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }

    public function resolucionesPorRelator(Request $request)
    {
        try {
            $relator = $request->query('relator');

            $query = DB::table('resoluciones')
                ->select(
                    'relator',
                    DB::raw('COUNT(id) as cantidad_resoluciones')
                )
                ->whereNotNull('relator') //  Omitir valores nulos
                ->whereNotIn('relator', [97, 99, 999]) //  Excluir valores inválidos
                ->where('relator', '!=', '') //  Omitir valores vacíos
                ->groupBy('relator') //  Agrupar solo por relator
                ->distinct() //  Evitar valores repetidos
                ->orderBy('relator', 'asc'); //  Orden alfabético para mejor legibilidad

            //  Filtrar por relator si se envía en la petición
            if (!empty($relator)) {
                $query->where('relator', $relator);
            }

            $resultados = $query->get();

            return response()->json($resultados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }


    public function listaRelatores()
    {
        try {
            $relatores = DB::table('resoluciones')
                ->select('relator')
                ->whereNotNull('relator')
                ->whereNotIn('relator', [97, 99, 999]) //  Excluir valores inválidos
                ->distinct()
                ->orderBy('relator', 'asc')
                ->get();

            return response()->json($relatores);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la lista de relatores: ' . $e->getMessage()], 500);
        }
    }

    public function resolucionesPorDepartamento(Request $request)
    {
        try {
            $departamentoId = $request->query('departamento_id');

            $query = DB::table('resoluciones as r')
                ->join('casos as c', 'r.caso_id', '=', 'c.id')
                ->join('departamentos as d', 'c.departamento_id', '=', 'd.id')
                ->select(
                    'd.nombre as departamento',
                    DB::raw('COUNT(r.id) as cantidad_resoluciones')
                )
                ->whereNotNull('c.departamento_id')
                ->groupBy('d.nombre') //  Agrupamos solo por departamento
                ->orderBy('d.nombre', 'asc'); //  Ordenamos por nombre de departamento

            //  Filtrar por departamento si se especifica en la petición
            if (!empty($departamentoId)) {
                $query->where('c.departamento_id', $departamentoId);
            }

            $resultados = $query->get();

            return response()->json($resultados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }


    public function listaDepartamentos()
    {
        try {
            $departamentos = DB::table('departamentos')
                ->select('id', 'nombre')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($departamentos);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la lista de departamentos: ' . $e->getMessage()], 500);
        }
    }

    public function listaMunicipios(Request $request)
    {
        try {
            $departamentoId = $request->query('departamento_id');

            $query = DB::table('municipios')
                ->select('id', 'nombre')
                ->orderBy('nombre', 'asc');

            if (!empty($departamentoId)) {
                $query->where('departamento_id', $departamentoId);
            }

            $municipios = $query->get();

            return response()->json($municipios);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la lista de municipios: ' . $e->getMessage()], 500);
        }
    }

    public function listaMunicipiosTodos()
    {
        try {
            $municipios = DB::table('municipios')
                ->select('id', 'nombre', 'departamento_id')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($municipios);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la lista de municipios: ' . $e->getMessage()], 500);
        }
    }


    public function listaAccionesConstitucionales()
    {
        try {
            $acciones = DB::table('acciones_constitucionales')
                ->select('id', 'nombre')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($acciones);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener las acciones constitucionales: ' . $e->getMessage()], 500);
        }
    }

    public function resolucionesPorAccionConstitucional(Request $request)
    {
        $query = DB::table('resoluciones')
            ->join('casos', 'resoluciones.caso_id', '=', 'casos.id')
            ->join('acciones_constitucionales', 'casos.accion_const_id', '=', 'acciones_constitucionales.id')
            ->select(
                'acciones_constitucionales.nombre as accion_constitucional',
                DB::raw('COUNT(resoluciones.id) as cantidad_resoluciones')
            )
            ->groupBy('acciones_constitucionales.nombre');

        if ($request->has('anio')) {
            $query->whereYear('resoluciones.res_fecha', $request->anio);
        }

        if ($request->has('mes')) {
            $query->whereMonth('resoluciones.res_fecha', $request->mes);
        }

        if ($request->has('accion_const_id')) {
            $query->where('casos.accion_const_id', $request->accion_const_id);
        }

        return $query->get();
    }

    public function obtenerSubtiposAccionesResoluciones($accionId)
    {
        $subtipos = DB::table('subtipos_acciones')
            ->join('acciones_constitucionales', 'subtipos_acciones.accion_id', '=', 'acciones_constitucionales.id')
            ->where('subtipos_acciones.accion_id', $accionId) // Filtra por la acción constitucional seleccionada
            ->select('subtipos_acciones.id', 'subtipos_acciones.nombre') // Solo seleccionamos los campos necesarios
            ->get();

        if ($subtipos->isEmpty()) {
            return response()->json(['message' => 'No hay subtipos de acción disponibles'], 404);
        }

        return response()->json($subtipos);
    }


    public function resolucionesPorSubtipoAccion(Request $request)
    {
        $query = DB::table('resoluciones')
            ->join('casos', 'resoluciones.caso_id', '=', 'casos.id')
            ->join('subtipos_acciones', 'casos.accion_const_id', '=', 'subtipos_acciones.id')
            ->select('subtipos_acciones.nombre as subtipo_accion', DB::raw('COUNT(resoluciones.id) as cantidad_resoluciones'))
            ->groupBy('subtipos_acciones.nombre');

        if ($request->has('accion_const_id')) {
            $query->where('subtipos_acciones.accion_id', $request->accion_const_id);
        }

        if ($request->has('subtipo_accion_id')) {
            $query->where('subtipos_acciones.id', $request->subtipo_accion_id); //  Aquí aplicamos el filtro correctamente
        }

        return response()->json($query->get());
    }

    // *********************** seleccion multiple casos ***********************

    public function obtenerEstadisticasCasos(Request $request)
    {
        try {
            $anio = $request->query('anio');
            $mes = $request->query('mes');

            $query = DB::table('casos as c')
                ->leftJoin('acciones_constitucionales as ac', 'c.accion_const2_id', '=', 'ac.id')
                ->leftJoin('subtipos_acciones as sa', 'c.accion_const_id', '=', 'sa.id')
                ->leftJoin('res_emisores as re', 'c.res_emisor_id', '=', 're.id')
                ->leftJoin('departamentos as d', 'c.departamento_id', '=', 'd.id')
                ->leftJoin('municipios as m', 'c.municipio_id', '=', 'm.id')
                ->select(
                    DB::raw('COALESCE(ac.nombre, "Sin Acción Constitucional") as accion_constitucional'),
                    DB::raw('COALESCE(sa.nombre, "Sin Subtipo") as subtipo_accion'),
                    DB::raw('COALESCE(re.nombre, "Sin Emisor") as res_emisor'),
                    DB::raw('COALESCE(d.nombre, "Sin Departamento") as departamento'),
                    DB::raw('COALESCE(m.nombre, "Sin Municipio") as municipio'),
                    DB::raw('DATE_FORMAT(c.fecha_ingreso, "%Y-%m") as fecha_ingreso'),
                    DB::raw('COUNT(c.id) as cantidad_casos')
                )
                ->whereNotNull('c.accion_const_id')
                ->whereNotNull('c.accion_const2_id')
                ->whereNotNull('c.res_emisor_id')
                ->whereNotNull('c.departamento_id')
                ->whereNotNull('c.municipio_id')
                ->groupBy('accion_constitucional', 'subtipo_accion', 'res_emisor', 'departamento', 'municipio', 'fecha_ingreso')
                ->orderBy('fecha_ingreso', 'asc');

            if (!empty($anio)) {
                $query->whereYear('c.fecha_ingreso', $anio);
            }
            if (!empty($mes)) {
                $query->whereMonth('c.fecha_ingreso', $mes);
            }

            $resultados = $query->get();

            return response()->json($resultados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }

    public function obtenerCasosFiltrados(Request $request)
    {
        try {
            $query = DB::table('casos as c')
                ->leftJoin('acciones_constitucionales as ac', 'c.accion_const2_id', '=', 'ac.id')
                ->leftJoin('subtipos_acciones as sa', 'c.accion_const_id', '=', 'sa.id')
                ->leftJoin('res_emisores as re', 'c.res_emisor_id', '=', 're.id')
                ->leftJoin('departamentos as d', 'c.departamento_id', '=', 'd.id')
                ->leftJoin('municipios as m', 'c.municipio_id', '=', 'm.id')
                ->select(
                    DB::raw('COALESCE(ac.nombre, "Sin tipo de acción") as accion_constitucional'),
                    DB::raw('COALESCE(sa.nombre, "Sin subtipo de acción") as subtipo_accion'),
                    DB::raw('COALESCE(re.nombre, "Sin res emisor") as res_emisor'),
                    DB::raw('COALESCE(d.nombre, "Sin departamento") as departamento'),
                    DB::raw('COALESCE(m.nombre, "Sin municipio") as municipio'),
                    DB::raw('COUNT(c.id) as cantidad_casos')
                )
                ->groupBy('ac.nombre', 'sa.nombre', 're.nombre', 'd.nombre', 'm.nombre');

            // Aplicar filtros si están presentes en la solicitud
            if ($request->filled('accion_const2_id')) {
                $query->where('c.accion_const2_id', $request->accion_const2_id);
            }
            if ($request->filled('accion_const_id')) {
                $query->where('c.accion_const_id', $request->accion_const_id);
            }
            if ($request->filled('res_emisor_id')) {
                $query->where('c.res_emisor_id', $request->res_emisor_id);
            }
            if ($request->filled('departamento_id')) {
                $query->where('c.departamento_id', $request->departamento_id);
            }
            if ($request->filled('municipio_id')) {
                $query->where('c.municipio_id', $request->municipio_id);
            }
            if ($request->filled('anio')) {
                $query->whereYear('c.fecha_ingreso', $request->anio);
            }
            if ($request->filled('mes')) {
                $query->whereMonth('c.fecha_ingreso', $request->mes);
            }

            $resultados = $query->get();

            return response()->json($resultados);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los datos: ' . $e->getMessage()], 500);
        }
    }

    public function obtenerResEmisores()
    {
        try {
            $resEmisores = DB::table('res_emisores')
                ->select('id', 'nombre', 'descripcion')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($resEmisores);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los res emisores: ' . $e->getMessage()], 500);
        }
    }

    // Obtener Departamentos
    public function obtenerDepartamentos()
    {
        try {
            $departamentos = DB::table('departamentos')
                ->select('id', 'nombre')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($departamentos);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los departamentos: ' . $e->getMessage()], 500);
        }
    }

    public function SubtiposAcciones()
    {
        try {
            $subtipos = DB::table('subtipos_acciones')
                ->select('id', 'nombre', 'codigo', 'accion_id')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($subtipos);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los subtipos de acciones: ' . $e->getMessage()], 500);
        }
    }
}