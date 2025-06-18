<?php

namespace App\Http\Controllers\Api;

use App\Models\Municipio;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
class MunicipioController extends Controller
{
    /**
     * Mostrar una lista de los municipios.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $municipios = Municipio::all();
        return response()->json($municipios);
    }

    /**
     * Mostrar el formulario para crear un nuevo municipio.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // Puede devolver una vista si es necesario
    }

    /**
     * Almacenar un nuevo municipio en la base de datos.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'departamento_id' => 'required|exists:departamentos,id',
        ]);

        $municipio = Municipio::create($request->all());
        return response()->json($municipio, 201);
    }

    /**
     * Mostrar el municipio especificado.
     *
     * @param \App\Models\Municipio $municipio
     * @return \Illuminate\Http\Response
     */
    public function show(Municipio $municipio)
    {
        return response()->json($municipio);
    }

    /**
     * Mostrar el formulario para editar el municipio especificado.
     *
     * @param \App\Models\Municipio $municipio
     * @return \Illuminate\Http\Response
     */
    public function edit(Municipio $municipio)
    {
        // Puede devolver una vista si es necesario
    }

    /**
     * Actualizar el municipio especificado en la base de datos.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Municipio $municipio
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Municipio $municipio)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'departamento_id' => 'required|exists:departamentos,id',
        ]);

        $municipio->update($request->all());
        return response()->json($municipio);
    }

    /**
     * Eliminar el municipio especificado de la base de datos.
     *
     * @param \App\Models\Municipio $municipio
     * @return \Illuminate\Http\Response
     */
    public function destroy(Municipio $municipio)
    {
        $municipio->delete();
        return response()->json(null, 204);
    }
}
