<?php
namespace App\Http\Controllers;

use App\Models\Departamentos;
use App\Models\Sala;
use App\Models\AccionConstitucional;
use App\Models\SubtipoAccion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class DatosInicialesController extends Controller
{
    public function obtenerDatosIniciales(Request $request)
    {
        // Consulta para obtener los departamentos
        $departamentos = Departamentos::all();

        // Consulta para obtener las salas
        $salas = Sala::all();

        // Consulta para obtener las acciones constitucionales
        $acciones = AccionConstitucional::all();

        // Consulta para obtener los periodos (asumiendo que es un año único por casos)
        $periodos = DB::table('casos')
            ->selectRaw('YEAR(fecha_ingreso) as periodo')
            ->distinct()
            ->pluck('periodo');

        // Obtener subtipos si hay una acción seleccionada
        $accionSeleccionada = $request->query('accionSeleccionada');
        $subtipos = [];

        if ($accionSeleccionada && $accionSeleccionada !== 'todos') {
            $subtipos = SubtipoAccion::where('accion_id', $accionSeleccionada)->get();
        } else {
            // Incluir una opción para 'todos' si no hay acción seleccionada
            $subtipos = SubtipoAccion::whereIn('accion_id', AccionConstitucional::pluck('id'))->get();
        }

        // Retornar todos los datos en una sola respuesta
        return response()->json([
            'departamentos' => $departamentos,
            'salas' => $salas,
            'acciones' => $acciones,
            'periodos' => $periodos,
            'subtipos' => $subtipos
        ]);
    }
}
