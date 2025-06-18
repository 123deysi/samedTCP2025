<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        // Verifica si el usuario está autenticado
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        // Asegúrate de que la relación role está cargada y existe
        if (!Auth::user()->role || Auth::user()->role->role != $role) {
            return response()->json(['message' => 'Forbidden: Insufficient permissions'], 403);
        }
        
        return $next($request);
    }
}