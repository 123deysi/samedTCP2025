<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Caso;
use App\Models\Resolucion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CasoController extends Controller
{
    /**
     * Muestra una lista de los casos.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $casos = Caso::with(['accionConstitucional', 'sala', 'departamento', 'municipio'])->get();
        return response()->json($casos);
    }

    public function todosLosAtributos()
{

    $casos = Caso::all();

    return response()->json($casos);
}
    /**
     * Almacena un nuevo caso en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'exp' => 'required|string|max:50',
            'accion_const_id' => 'nullable|exists:subtipos_acciones,id',
            'accion_const2_id' => 'nullable|exists:acciones_constitucionales,id',
            'departamento_id' => 'nullable|exists:departamentos,id',
            'municipio_id' => 'nullable|exists:municipios,id',
           'fecha_ingreso' => 'nullable|date_format:Y-m-d',
        ]);

        $caso = Caso::create($request->all());
        return response()->json($caso, 201);
    }

    /**
     * Muestra un caso específico.
     *
     * @param  \App\Models\Caso  $caso
     * @return \Illuminate\Http\Response
     */
    public function show(Caso $caso)
    {
        $caso->load(['accionConstitucional', 'sala', 'departamento', 'municipio']);
        return response()->json($caso);
    }
    public function casosPorFechaIngreso()
{
    $casosPorFechaIngreso = DB::table('casos')
        ->select(DB::raw('YEAR(fecha_ingreso) AS anio'), DB::raw('MONTH(fecha_ingreso) AS mes'), DB::raw('COUNT(id) AS cantidad_casos'))
        ->whereNotNull('fecha_ingreso') // Excluir registros con fecha_ingreso null
        ->groupBy(DB::raw('YEAR(fecha_ingreso)'), DB::raw('MONTH(fecha_ingreso)'))
        ->orderBy(DB::raw('YEAR(fecha_ingreso)'), 'asc')
        ->orderBy(DB::raw('MONTH(fecha_ingreso)'), 'asc')
        ->get();

    return response()->json($casosPorFechaIngreso);
}


public function obtenerAniosUnicos()
{
    $aniosUnicos = DB::table('casos')
        ->select(DB::raw('YEAR(fecha_ingreso) AS año'))
        ->distinct()  // Asegura que solo se devuelvan años únicos
        ->orderBy(DB::raw('YEAR(fecha_ingreso)'), 'asc')
        ->pluck('año');
    return response()->json($aniosUnicos);
}
public function casosPorPeriodo() {
    $resultados = DB::table('casos')
    ->selectRaw('YEAR(fecha_ingreso) as anio, MONTH(fecha_ingreso) as mes, COUNT(*) as cantidad_casos')
    ->whereNotNull('fecha_ingreso')
    ->groupBy('anio', 'mes')
    ->orderBy('anio', 'asc')
    ->orderBy('mes', 'asc')
    ->get();

return response()->json($resultados);
}

public function casosPorAnio()
{
    // Consulta para obtener el conteo de resoluciones agrupadas por año
    $casosPorAnio = DB::table('casos')
        ->select(DB::raw('YEAR(fecha_ingreso) AS anio'), DB::raw('COUNT(id) AS cantidad_casos'))
        ->whereNotNull('fecha_ingreso') // Asegurarse de que res_fecha no sea nulo
        ->groupBy(DB::raw('YEAR(fecha_ingreso)'))
        ->orderBy('anio', 'asc') // Ordenar por año de forma ascendente
        ->get();

    // Retornar el resultado en formato JSON
    return response()->json($casosPorAnio);
}



    public function casosPorDepartamento(Request $request)
    {
        $departamentos_id = $request->query('departamentos_id');

        $departamentos_id = json_decode($departamentos_id, true);

        $query = DB::table('departamentos')
            ->leftJoin('casos', 'departamentos.id', '=', 'casos.departamento_id')
            ->select('departamentos.nombre AS departamento', DB::raw('COUNT(casos.id) AS cantidad_casos'))
            ->groupBy('departamentos.nombre');

        if (is_array($departamentos_id) && !empty($departamentos_id)) {
            $query->whereIn('departamentos.id', $departamentos_id);
        }

        $casosPorDepartamento = $query->get();

        return response()->json($casosPorDepartamento);
    }
public function casosPorMunicipio(Request $request)
{
    $municipios = DB::table('municipios')
        ->join('casos', 'municipios.id', '=', 'casos.municipio_id')
        ->select('municipios.nombre as municipio', DB::raw('COUNT(casos.id) as cantidad_de_casos'))
        ->groupBy('municipios.nombre')
        ->get();
    return response()->json($municipios);
}
public function casosPorDepartamentoYMunicipio(Request $request)
{
    $orderDirection = $request->input('order', 'asc');
    if (!in_array($orderDirection, ['asc', 'desc'])) {
        return response()->json(['error' => 'Invalid order direction'], 400);
    }
    $departmentId = $request->input('departamento_id');
    $query = DB::table('casos as c')
        ->select('d.nombre as departamento', 'm.nombre as municipio', DB::raw('COUNT(c.id) as cantidad_de_casos'))
        ->leftJoin('departamentos as d', 'c.departamento_id', '=', 'd.id')
        ->leftJoin('municipios as m', 'c.municipio_id', '=', 'm.id')
        ->groupBy('d.nombre', 'm.nombre')
        ->orderBy('d.nombre', $orderDirection)
        ->orderBy('m.nombre', $orderDirection);
    if ($departmentId) {
        $query->where('c.departamento_id', $departmentId);
    }
    $results = $query->get();
    return response()->json($results);
}
    /**
     * Actualiza un caso existente en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Caso  $caso
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Caso $caso)
    {
        $request->validate([
            'exp' => 'required|string|max:50',
            'ref' => 'nullable|string',
            'accion_constitucional_id' => 'nullable|exists:acciones_constitucionales,id',
            'año_codif' => 'nullable|integer',
            'sala_id' => 'nullable|exists:salas,id',
            'departamento_id' => 'nullable|exists:departamentos,id',
            'municipio_id' => 'nullable|exists:municipios,id',
            'restiempo' => 'nullable|numeric',
            'codificador' => 'nullable|string|max:100',
            'observaciones' => 'nullable|string',
            'fecha_ingreso' => 'nullable|date',
        ]);
        $caso->update($request->all());
        return response()->json($caso);
    }
    /**
     * Elimina un caso de la base de datos.
     *
     * @param  \App\Models\Caso  $caso
     * @return \Illuminate\Http\Response
     */
    public function destroy(Caso $caso)
    {
        $caso->delete();
        return response()->json(null, 204);
    }
    public function contarCasos(Request $request)
    {
        $departamentoId = $request->query('departamento_id');
        $salaId = $request->query('sala_id');
        $periodo = $request->query('periodo'); // Asumiendo que es el año de fecha_ingreso
        $accionId = $request->query('accion_id');
        $subtipoId = $request->query('subtipo_id');
        $query = Caso::query();
        if ($departamentoId) {
            $query->where('departamento_id', $departamentoId);
        }
        if ($salaId) {
            $query->where('sala_id', $salaId);
        }
        if ($periodo) {
            $query->whereYear('fecha_ingreso', $periodo);
        }
        if ($accionId) {
            $query->where('subtipo_accion_id', function ($subquery) use ($accionId) {
                $subquery->select('id')
                    ->from('subtipos_accion')
                    ->where('accion_id', $accionId);
            });
        }
        if ($subtipoId) {
            $query->where('subtipo_accion_id', $subtipoId);
        }
        $conteo = $query->get(); // Obtén todos los casos que cumplen con los filtros
        return response()->json(['conteo' => $conteo]);
    }
    public function resolucionesPorDepartamentoYTipo(Request $request) {
        $query = DB::table('resoluciones as r')
            ->leftJoin('tipos_resoluciones as tr', 'r.res_tipo_id', '=', 'tr.id')
            ->leftJoin('tipos_resoluciones2 as tr2', 'r.res_tipo2_id', '=', 'tr2.id')
            ->leftJoin('casos as c', 'r.caso_id', '=', 'c.id')
            ->leftJoin('municipios as m', 'c.municipio_id', '=', 'm.id')
            ->leftJoin('departamentos as d', 'm.departamento_id', '=', 'd.id')
            ->select('d.nombre as departamento',
                     'tr2.descripcion as tipo_resolucion2',
                     'tr.descripcion as sub_tipo_resolucion',
                     DB::raw('COUNT(r.numres2) as cantidad_resoluciones'));

        // Filtrado por departamento
        if ($request->has('departamento_id')) {
            $query->where('d.id', $request->departamento_id);
        }

        // Filtrado por tipo_resolucion2
        if ($request->has('res_tipo2')) {
            $query->where('tr2.descripcion', $request->res_tipo2);
        }

        $resoluciones = $query->groupBy('d.nombre', 'tr2.descripcion', 'tr.descripcion')
            ->orderBy('d.nombre', 'asc')
            ->orderBy('tr2.descripcion', 'asc')
            ->orderBy('tr.descripcion', 'asc')
            ->get();

        return response()->json($resoluciones);
    }

    public function resolucionesPorTipo2(Request $request) {
        $query = DB::table('resoluciones as r')
            ->leftJoin('tipos_resoluciones2 as tr2', 'r.res_tipo2_id', '=', 'tr2.id')
            ->leftJoin('casos as c', 'r.caso_id', '=', 'c.id')
            ->leftJoin('municipios as m', 'c.municipio_id', '=', 'm.id')
            ->leftJoin('departamentos as d', 'm.departamento_id', '=', 'd.id')
            ->select('d.nombre as departamento',
                     'tr2.descripcion as tipo_resolucion2',
                     DB::raw('COUNT(r.numres2) as cantidad_resoluciones'));

        // Filtrado por departamento
        if ($request->has('departamento_id')) {
            $query->where('d.id', $request->departamento_id);
        }

        // Filtrado por tipo_resolucion2
        if ($request->has('res_tipo2')) {
            $query->where('tr2.descripcion', $request->res_tipo2);
        }

        $resoluciones = $query->groupBy('d.nombre', 'tr2.descripcion')
            ->orderBy('d.nombre', 'asc')
            ->orderBy('tr2.descripcion', 'asc')
            ->get();

        return response()->json($resoluciones);
    }





    //PARA OBTENER EL TOTAL DE CASOS

    public function contarCasosYResoluciones()
    {
        // Contar el total de casos
        $totalCasos = DB::table('casos')->count();
        // Contar el total de resoluciones
        $totalResoluciones = DB::table('resoluciones')->count();
        // Calcular los casos no resueltos
        $casosNoResueltos = $totalCasos - $totalResoluciones;
        // Retornar el resultado como JSON
        return response()->json([
            'total_casos' => $totalCasos,
            'total_resoluciones' => $totalResoluciones,
            'casos_no_resueltos' => $casosNoResueltos,
        ]);
    }
    public function contarCasosResEmisor(Request $request){

        $resEmisor_id = $request->query('res_emisor_id');
        $query = DB::table('res_emisores')
            ->leftJoin('casos', 'res_emisores.id', '=', 'casos.res_emisor_id')
            ->select('res_emisores.nombre AS resEmisor', DB::raw('COUNT(casos.id) AS cantidad_casos_Emisor'))
            ->groupBy('res_emisores.nombre');
        if ($resEmisor_id) {
            $query->where('res_emisores.id', $resEmisor_id);
        }
        $casosPorResEmisor = $query->get();
        return response()->json($casosPorResEmisor);
    }


    // Obtiene casos agrupados por año y mes de fecha de ingreso



}
