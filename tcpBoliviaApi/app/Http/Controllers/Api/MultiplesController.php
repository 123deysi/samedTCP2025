<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MultiplesController extends Controller
{
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

    public function listaMunicipios()
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

    public function listaResEmisor()
    {
        try {
            $resemisores = DB::table('res_emisores')
                ->select('id', 'nombre', 'descripcion')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($resemisores);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la lista de resemisores: ' . $e->getMessage()], 500);
        }
    }

    public function listaAccionConstitucional()
    {
        try {
            $accionesConstitucionales = DB::table('acciones_constitucionales')
                ->select('id', 'nombre')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($accionesConstitucionales);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la lista de accionesConstitucionales: ' . $e->getMessage()], 500);
        }
    }

    public function listaSubtipoAccionConstitucional()
    {
        try {
            $subtiposAcciones = DB::table('subtipos_acciones')
                ->select('id', 'nombre', 'codigo', 'accion_id')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json($subtiposAcciones);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la lista de subtiposAcciones: ' . $e->getMessage()], 500);
        }
    }


    public function estadisticasCasos(Request $request)
    {
        try {
            $query = DB::table('casos')->select(DB::raw('COUNT(casos.id) as total'));
            $groupByColumns = [];
            $joins = [];
            $subFilters = [];
    
            // Mapear los filtros dinámicamente
            $filters = [
                'departamento' => ['departamentos as dept_casos', 'casos.departamento_id', 'dept_casos.id', 'nombre', 'Otros'],
                'municipio' => ['municipios', 'casos.municipio_id', 'municipios.id', 'nombre', 'Sin Municipio'],
                'res_emisor' => ['res_emisores', 'casos.res_emisor_id', 'res_emisores.id', 'nombre', 'Sin Res Emisor'],
                'accion_constitucional' => ['acciones_constitucionales', 'casos.accion_const2_id', 'acciones_constitucionales.id', 'nombre', 'Sin Acción Constitucional'],
            ];
    
            foreach ($filters as $key => [$table, $foreignKey, $primaryKey, $columnName, $default]) {
                if ($request->has($key)) {
                    $query->leftJoin($table, $foreignKey, '=', $primaryKey);
    
                    if ($key === 'res_emisor') {
                        // Concatenar nombre - descripción
                        $query->addSelect(DB::raw("CONCAT(res_emisores.nombre, ' - ', COALESCE(res_emisores.descripcion, 'Sin descripción')) as res_emisor"));
                        $groupByColumns[] = DB::raw("CONCAT(res_emisores.nombre, ' - ', COALESCE(res_emisores.descripcion, 'Sin descripción'))");
    
                        $query->whereNotNull("res_emisores.nombre")
                            ->where("res_emisores.nombre", '!=', $default);
                    } else if ($key === 'municipio') {
                        // Formatear el nombre del municipio: si es "Capital X", devolver solo "Capital"
                        $query->addSelect(DB::raw("
                            CASE 
                                WHEN municipios.nombre REGEXP '^Capital [0-9]+$' THEN 'Capital'
                                ELSE COALESCE(municipios.nombre, 'Sin Municipio')
                            END as municipio
                        "));
                        // Agrupar usando la misma lógica que en el SELECT
                        $groupByColumns[] = DB::raw("
                            CASE 
                                WHEN municipios.nombre REGEXP '^Capital [0-9]+$' THEN 'Capital'
                                ELSE COALESCE(municipios.nombre, 'Sin Municipio')
                            END
                        ");
    
                        // Hacer JOIN con la tabla departamentos para obtener el nombre del departamento
                        $query->leftJoin('departamentos', 'municipios.departamento_id', '=', 'departamentos.id');
                        $query->addSelect(DB::raw("COALESCE(departamentos.nombre, 'Desconocido') as departamento_nombre"));
                        $groupByColumns[] = "departamentos.nombre";
    
                        $query->whereNotNull("municipios.nombre")
                            ->where("municipios.nombre", '!=', $default);
                    } else if ($key === 'departamento') {
                        // Usar el alias dept_casos para el filtro departamento
                        $query->addSelect(DB::raw("COALESCE(dept_casos.nombre, 'Otros') as departamento"));
                        $groupByColumns[] = "dept_casos.nombre";
                        $query->whereNotNull("dept_casos.nombre")
                            ->where("dept_casos.nombre", '!=', $default);
                    } else {
                        $query->addSelect("$table.$columnName as $key");
                        $groupByColumns[] = "$table.$columnName";
                        $query->whereNotNull("$table.$columnName")
                            ->where("$table.$columnName", '!=', $default);
                    }
                }
            }
    
            // Si se selecciona "subtipo_accion_constitucional"
            if ($request->has('subtipo_accion_constitucional')) {
                $query->leftJoin('subtipos_acciones', 'casos.accion_const_id', '=', 'subtipos_acciones.id');
                $query->addSelect(DB::raw("COALESCE(subtipos_acciones.nombre, 'Sin Subtipo') as subtipo_accion_constitucional"));
                $groupByColumns[] = 'subtipos_acciones.nombre';
    
                // Usar alias para evitar conflicto con filtro "accion_constitucional"
                $query->leftJoin('acciones_constitucionales as ac2', 'subtipos_acciones.accion_id', '=', 'ac2.id');
                $query->addSelect(DB::raw("COALESCE(ac2.nombre, 'Sin Acción Constitucional') as accion_constitucional"));
                $groupByColumns[] = DB::raw("COALESCE(ac2.nombre, 'Sin Acción Constitucional')");
    
                // Obtener valores únicos para los sub-checkboxes
                $subFilters = DB::table('subtipos_acciones')->pluck('nombre')->toArray();
            }
    
            // Si se selecciona "fecha_ingreso"
            if ($request->has('fecha_ingreso')) {
                $query->addSelect(DB::raw("YEAR(casos.fecha_ingreso) as anio"));
                $query->whereNotNull('casos.fecha_ingreso'); // Solo registros con fecha válida
                $groupByColumns[] = "anio";
            }
    
            // Aplicar joins dinámicamente
            foreach ($joins as $table => $condition) {
                $query->leftJoin($table, ...$condition);
            }
    
            // Asegurar que se agrupa por cada filtro seleccionado
            if (!empty($groupByColumns)) {
                $query->groupBy($groupByColumns);
            }
    
            return response()->json([
                'data' => $query->get(),
                'sub_filters' => $subFilters
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener estadísticas: ' . $e->getMessage()], 500);
        }
    }


    public function estadisticasResoluciones(Request $request)
    {
        try {
            $query = DB::table('resoluciones')
                ->leftJoin('casos', 'resoluciones.caso_id', '=', 'casos.id')
                ->leftJoin('departamentos', 'casos.departamento_id', '=', 'departamentos.id')
                ->leftJoin('subtipos_acciones', 'casos.accion_const_id', '=', 'subtipos_acciones.id')
                ->leftJoin('acciones_constitucionales', 'subtipos_acciones.accion_id', '=', 'acciones_constitucionales.id')
                ->leftJoin('tipos_resoluciones', 'resoluciones.res_tipo_id', '=', 'tipos_resoluciones.id')
                ->leftJoin('tipos_resoluciones2', 'resoluciones.res_tipo2_id', '=', 'tipos_resoluciones2.id')
                ->select(DB::raw('COUNT(resoluciones.id) as cantidad_resoluciones'));

            $groupByColumns = [];
            $subFilterColumnRaw = null;

            $filters = [
                'res_fecha' => ['resoluciones.res_fecha', 'res_fecha'],
                'res_tipo2_' => ['tipos_resoluciones2.descripcion', 'tipo_resolucion_2'],
                'res_tipo_id' => ['tipos_resoluciones.descripcion', 'tipo_resolucion'],
                'res_fondo_voto' => ['resoluciones.res_fondo_voto', 'res_fondo_voto'],
                'res_resul' => ['resoluciones.resresul', 'resresul'],
                'revresul' => ['resoluciones.revresul', 'revresul'],
                'resfinal' => ['resoluciones.resfinal', 'resfinal'],
                'restiempo' => ['resoluciones.restiempo', 'restiempo'],
                'relator' => ['resoluciones.relator', 'relator'],
                'departamento' => ['departamentos.nombre', 'departamento'],
                'accion_constitucional' => ['acciones_constitucionales.nombre', 'accion_constitucional'],
                'subtipo_accion_constitucional' => ['subtipos_acciones.nombre', 'subtipo_accion_constitucional'],

            ];

            $selectedFilters = array_keys(array_filter($request->all(), fn($v) => $v === "true"));

            if (count($selectedFilters) !== 2) {
                return response()->json(['error' => 'Debe seleccionar exactamente dos filtros.'], 400);
            }

            [$firstFilter, $secondFilter] = $selectedFilters;

            Log::debug('Filtros seleccionados', [
                'firstFilter' => $firstFilter,
                'secondFilter' => $secondFilter
            ]);

            if (!isset($filters[$firstFilter]) || !isset($filters[$secondFilter])) {
                return response()->json(['error' => 'Filtros inválidos.'], 400);
            }

            $field1 = $filters[$firstFilter][0];
            $alias1 = $filters[$firstFilter][1];

            $field2 = $filters[$secondFilter][0];
            $alias2 = $filters[$secondFilter][1];

            $addSelectWithDescription = function ($field, $alias) use ($query, &$groupByColumns) {
                switch ($alias) {
                    case 'res_fondo_voto':
                        $query->addSelect("resoluciones.res_fondo_voto as res_fondo_voto");
                        $query->addSelect(DB::raw("CASE 
                            WHEN resoluciones.res_fondo_voto = 1 THEN 'Resolución unánime'
                            WHEN resoluciones.res_fondo_voto = 2 THEN 'Resolución con disidencia'
                            ELSE 'Otro'
                        END as res_fondo_voto_desc"));
                        $groupByColumns[] = "resoluciones.res_fondo_voto";
                        break;

                    case 'resresul':
                        $query->addSelect("resoluciones.resresul as resresul");
                        $query->addSelect(DB::raw("CASE 
                            WHEN resoluciones.resresul = 1 THEN 'Concede todo lo solicitado por el recurrente'
                            WHEN resoluciones.resresul = 2 THEN 'Deniega todo'
                            WHEN resoluciones.resresul = 3 THEN 'Parcial, concede en parte, deniega en parte'
                            ELSE 'Otro'
                        END as resresul_desc"));
                        $groupByColumns[] = "resoluciones.resresul";
                        break;

                    case 'resfinal':
                        $query->addSelect("resoluciones.resfinal as resfinal");
                        $query->addSelect(DB::raw("CASE 
                            WHEN resoluciones.resfinal = 1 THEN 'Concede todo lo solicitado por el recurrente'
                            WHEN resoluciones.resfinal = 2 THEN 'Deniega todo'
                            WHEN resoluciones.resfinal = 3 THEN 'Parcial concede en parte, deniega en parte'
                            ELSE 'Otro'
                        END as resfinal_desc"));
                        $groupByColumns[] = "resoluciones.resfinal";
                        break;

                    case 'revresul':
                        $query->addSelect("resoluciones.revresul as revresul");
                        $query->addSelect(DB::raw("CASE 
                            WHEN resoluciones.revresul = 1 THEN 'Confirma totalmente las decisiones del tribunal inferior'
                            WHEN resoluciones.revresul = 2 THEN 'Revoca totalmente'
                            WHEN resoluciones.revresul = 3 THEN 'Parcial, confirma en parte y revoca en parte'
                            ELSE 'Otro'
                        END as revresul_desc"));
                        $groupByColumns[] = "resoluciones.revresul";
                        break;

                    case 'res_fecha':
                        $query->addSelect(DB::raw("YEAR(resoluciones.res_fecha) as res_fecha"));
                        $groupByColumns[] = DB::raw("YEAR(resoluciones.res_fecha)");
                        break;

                    case 'subtipo_accion_constitucional':
                        $query->addSelect("subtipos_acciones.nombre as subtipo_accion_constitucional");
                        $groupByColumns[] = "subtipos_acciones.nombre";
                        break;

                    case 'accion_constitucional':
                        $query->addSelect("acciones_constitucionales.nombre as accion_constitucional");
                        $groupByColumns[] = "acciones_constitucionales.nombre";
                        break;

                    default:
                        $query->addSelect(DB::raw("COALESCE($field, 'Sin datos') as $alias"));
                        $groupByColumns[] = $field;
                }
            };

            $addSelectWithDescription($field1, $alias1);
            $addSelectWithDescription($field2, $alias2);

            if ($alias1 === 'res_fecha') {
                $subFilterColumnRaw = DB::raw("YEAR(resoluciones.res_fecha)");
            } else {
                $subFilterColumnRaw = $field1;
            }


            $omitValuesFilterFields = [
                'resoluciones.res_fondo_voto',
                'resoluciones.resresul',
                'resoluciones.resfinal',
                'resoluciones.revresul',
            ];

            foreach ([[$field1, $alias1], [$field2, $alias2]] as [$field, $alias]) {
                $query->whereNotNull($field);

                if (in_array($field, $omitValuesFilterFields)) {
                    $query->where($field, '!=', '97');
                    $query->where($field, '!=', '999');
                } elseif ($alias === 'res_fecha') {
                    // $query->whereRaw('YEAR(resoluciones.res_fecha) != 1997');
                } else {
                    $query->whereNotIn($field, ['97', '999', 'Otros', 'Otro', 'Sin datos']);
                }
            }

            if ($subFilterColumnRaw && $request->has('sub_filters')) {
                $selectedSubFilters = explode(',', $request->input('sub_filters'));
                $query->whereIn($subFilterColumnRaw, $selectedSubFilters);
            }

            if (!empty($groupByColumns)) {
                $query->groupBy($groupByColumns);
            }

            if (!$subFilterColumnRaw) {
                return response()->json(['error' => 'No se pudo determinar el campo para los subfiltros.'], 400);
            }

            $uniqueValuesQuery = DB::table('resoluciones')
                ->leftJoin('casos', 'resoluciones.caso_id', '=', 'casos.id')
                ->leftJoin('departamentos', 'casos.departamento_id', '=', 'departamentos.id')
                ->leftJoin('subtipos_acciones', 'casos.accion_const_id', '=', 'subtipos_acciones.id')
                ->leftJoin('acciones_constitucionales', 'subtipos_acciones.accion_id', '=', 'acciones_constitucionales.id')
                ->leftJoin('tipos_resoluciones', 'resoluciones.res_tipo_id', '=', 'tipos_resoluciones.id')
                ->leftJoin('tipos_resoluciones2', 'resoluciones.res_tipo2_id', '=', 'tipos_resoluciones2.id')
                ->select(DB::raw("DISTINCT " . ($alias1 === 'res_fecha' ? "YEAR(resoluciones.res_fecha)" : "COALESCE($subFilterColumnRaw, 'Sin datos')") . " as valor"))
                ->whereNotNull($subFilterColumnRaw)
                ->whereNotIn($subFilterColumnRaw, ['97', '999', 'Otros', 'Otro', 'Sin datos'])
                ->pluck('valor')
                ->toArray();

            return response()->json([
                'data' => $query->get(),
                'sub_filters' => $uniqueValuesQuery
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener estadísticas: ' . $e->getMessage()], 500);
        }
    }
}
