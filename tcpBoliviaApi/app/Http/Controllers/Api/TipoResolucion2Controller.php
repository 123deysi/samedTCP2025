<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipoResolucion2;
use Illuminate\Http\Request;

class TipoResolucion2Controller extends Controller
{
    /**
     * Muestra una lista de los tipos de resoluciones.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tipos = TipoResolucion2::all();
        return response()->json($tipos);
    }

    /**
     * Almacena un nuevo tipo de resolución en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([

            'codigo' => 'required|integer|max:9999999999',
            'descripcion' => 'required|string|max:100',
        ]);

        $tipo = TipoResolucion2::create($request->all());

        return response()->json($tipo, 201);
    }

    /**
     * Muestra un tipo de resolución específico.
     *
     * @param  \App\Models\TipoResolucion  $tipoResolucion
     * @return \Illuminate\Http\Response
     */
    public function show(TipoResolucion2 $tipoResolucion)
    {
        return response()->json($tipoResolucion);
    }

    /**
     * Actualiza un tipo de resolución existente en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TipoResolucion  $tipoResolucion
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TipoResolucion2 $tipoResolucion)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $tipoResolucion->update($request->all());

        return response()->json($tipoResolucion);
    }

    /**
     * Elimina un tipo de resolución de la base de datos.
     *
     * @param  \App\Models\TipoResolucion  $tipoResolucion
     * @return \Illuminate\Http\Response
     */
    public function destroy(TipoResolucion $tipoResolucion2)
    {
        $tipoResolucion2->delete();

        return response()->json(null, 204);
    }
}
