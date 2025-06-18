<?php

namespace App\Http\Controllers\Api;

use App\Models\Departamentos;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
class DepartamentoController extends Controller
{
    /**
     * Muestra una lista de departamentos.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $departamentos = Departamentos::all();
        return response()->json($departamentos);
    }

    /**
     * Muestra el formulario para crear un nuevo departamento.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // Puedes devolver una vista aquí si lo prefieres
    }

    /**
     * Almacena un nuevo departamento en la base de datos.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $departamento = Departamentos::create($request->all());

        return response()->json($departamento, 201);
    }

    /**
     * Muestra un departamento específico.
     *
     * @param  \App\Models\Departamentos  $departamento
     * @return \Illuminate\Http\Response
     */
    public function showDepartamentos(Departamentos $departamento)
    {
        $departamento = Departamentos::all();

        return response()->json($departamento);
    }

    /**
     * Muestra el formulario para editar un departamento específico.
     *
     * @param  \App\Models\Departamentos  $departamento
     * @return \Illuminate\Http\Response
     */
    public function edit(Departamentos $departamento)
    {
        // Puedes devolver una vista aquí si lo prefieres
    }

    /**
     * Actualiza un departamento específico en la base de datos.
     *
     * @param \Illuminate\Http\Request $request
     * @param  \App\Models\Departamentos  $departamento
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Departamentos $departamento)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $departamento->update($request->all());

        return response()->json($departamento);
    }

    /**
     * Elimina un departamento específico de la base de datos.
     *
     * @param  \App\Models\Departamentos  $departamento
     * @return \Illuminate\Http\Response
     */
    public function destroy(Departamentos $departamento)
    {
        $departamento->delete();

        return response()->json(null, 204);
    }
}
