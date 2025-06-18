<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccionConstitucional;
use Illuminate\Http\Request;

class AccionConstitucionalController extends Controller
{
    /**
     * Muestra una lista de las acciones constitucionales.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $acciones = AccionConstitucional::all();
        return response()->json($acciones);
    }

    /**
     * Almacena una nueva acción constitucional en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $accion = AccionConstitucional::create($request->all());

        return response()->json($accion, 201);
    }

    /**
     * Muestra una acción constitucional específica.
     *
     * @param  \App\Models\AccionConstitucional  $accionConstitucional
     * @return \Illuminate\Http\Response
     */
    public function showAccionConstitucional(AccionConstitucional $accionConstitucional)
    {
        $accionConstitucional = AccionConstitucional::all();
        return response()->json($accionConstitucional);
    }

    /**
     * Actualiza una acción constitucional existente en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AccionConstitucional  $accionConstitucional
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AccionConstitucional $accionConstitucional)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $accionConstitucional->update($request->all());

        return response()->json($accionConstitucional);
    }

    /**
     * Elimina una acción constitucional de la base de datos.
     *
     * @param  \App\Models\AccionConstitucional  $accionConstitucional
     * @return \Illuminate\Http\Response
     */
    public function destroy(AccionConstitucional $accionConstitucional)
    {
        $accionConstitucional->delete();

        return response()->json(null, 204);
    }
}
