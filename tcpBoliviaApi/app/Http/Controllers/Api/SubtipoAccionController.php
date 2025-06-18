<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SubtipoAccion;
use App\Models\AccionConstitucional;

class SubtipoAccionController extends Controller
{
    // Mostrar todos los subtipos de acciones
    public function index()
    {
        $subtiposAcciones = SubtipoAccion::all();
        return response()->json($subtiposAcciones);
    }
    // Mostrar un subtipo de acción específico
    public function show($id)
    {
        $subtipoAccion = SubtipoAccion::findOrFail($id);
        return response()->json($subtipoAccion);
    }

    // Crear un nuevo subtipo de acción
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'codigo' => 'required|string|max:10',
            'tipo' => 'required|string|max:50',
            'accion_const2_id' => 'required|exists:acciones_constitucionales,id',
        ]);

        $subtipoAccion = SubtipoAccion::create($request->all());

        return response()->json($subtipoAccion, 201);
    }

    public function indexSubtipo($accion_id)
    {
        // Encuentra la acción constitucional por ID
        $accionConstitucional = AccionConstitucional::findOrFail($accion_id);

        // Obtiene todos los subtipos asociados a esta acción constitucional
        $subtipos = $accionConstitucional->subtipos;

        // Devuelve los subtipos en formato JSON
     return response()->json($subtipos);
    }


    // Actualizar un subtipo de acción existente
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'sometimes|required|string|max:100',
            'codigo' => 'sometimes|required|string|max:10',
            'tipo' => 'sometimes|required|string|max:50',
            'accion_const2_id' => 'sometimes|required|exists:acciones_constitucionales,id',
        ]);

        $subtipoAccion = SubtipoAccion::findOrFail($id);
        $subtipoAccion->update($request->all());

        return response()->json($subtipoAccion);
    }

    // Eliminar un subtipo de acción
    public function destroy($id)
    {
        $subtipoAccion = SubtipoAccion::findOrFail($id);
        $subtipoAccion->delete();

        return response()->json(null, 204);
    }
}
