<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        // Obtener todos los roles de la base de datos
        $roles = Role::all();

        // Devolver los roles como JSON
        return response()->json($roles);
    }
}
