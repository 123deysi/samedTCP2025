<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResEmisor;
use Illuminate\Http\Request;

class ResEmisorController extends Controller
{
    /**
     * Muestra una lista de las salas.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $resEmisor = ResEmisor::all();
        return response()->json($resEmisor);
    }

    /**
     * Almacena una nueva sala en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $resEmisor= ResEmisor::create($request->all());

        return response()->json($resEmisor, 201);
    }

    /**
     * Muestra una sala específica.
     *
     * @param  \App\Models\ResEmisor  $sala
     * @return \Illuminate\Http\Response
     */
    public function showResEmisor(ResEmisor $resEmisor)
    {

        $resEmisor = ResEmisor::all();

        return response()->json($resEmisor);
    }

    /**
     * Actualiza una sala existente en la base de datos.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ResEmisor  $resEmisor
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ResEmisor $resEmisor)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $resEmisor->update($request->all());

        return response()->json($resEmisor);
    }

    /**
     * Elimina una sala de la base de datos.
     *
     * @param  \App\Models\ResEmisor  $resEmisor
     * @return \Illuminate\Http\Response
     */
    public function destroy(ResEmisor $resEmisor)
    {
        $resEmisor->delete();

        return response()->json(null, 204);
    }
}
