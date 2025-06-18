<?php

namespace App\Http\Controllers;

use App\Models\TipoResolucion;
use Illuminate\Http\Request;

class TipoResolucionController extends Controller
{
    public function index()
    {
        // Obtener todos los tipos de resolución
        $tiposResoluciones = TipoResolucion::all();
        return response()->json($tiposResoluciones);
    }

    public function store(Request $request)
    {
        // Validar la solicitud
        $request->validate([
            'codigo' => 'required|integer',
            'nombre' => 'required|string|max:100',
        ]);

        // Crear un nuevo tipo de resolución
        $tipoResolucion = TipoResolucion::create($request->all());

        return response()->json($tipoResolucion, 201);
    }

    public function show($id)
    {
        // Obtener un tipo de resolución específico por su ID
        $tipoResolucion = TipoResolucion::find($id);

        if (!$tipoResolucion) {
            return response()->json(['message' => 'Tipo de resolución no encontrado'], 404);
        }

        return response()->json($tipoResolucion);
    }

    public function update(Request $request, $id)
    {
        // Validar la solicitud
        $request->validate([
            'codigo' => 'required|integer',
            'nombre' => 'required|string|max:100',
        ]);

        // Buscar el tipo de resolución por su ID
        $tipoResolucion = TipoResolucion::find($id);

        if (!$tipoResolucion) {
            return response()->json(['message' => 'Tipo de resolución no encontrado'], 404);
        }

        // Actualizar el tipo de resolución
        $tipoResolucion->update($request->all());

        return response()->json($tipoResolucion);
    }

    public function destroy($id)
    {
        // Buscar el tipo de resolución por su ID
        $tipoResolucion = TipoResolucion::find($id);

        if (!$tipoResolucion) {
            return response()->json(['message' => 'Tipo de resolución no encontrado'], 404);
        }

        // Eliminar el tipo de resolución
        $tipoResolucion->delete();

        return response()->json(['message' => 'Tipo de resolución eliminado']);
    }
}
