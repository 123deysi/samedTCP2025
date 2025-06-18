<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubtipoAccion extends Model
{
    use HasFactory;

    // Tabla asociada al modelo
    protected $table = 'subtipos_acciones';

    // Campos asignables masivamente
    protected $fillable = [
        'nombre',
        'codigo',
        'accion_id',
    ];
    // Relación con la tabla acciones_constitucionales
    public function accionConstitucional()
    {
        return $this->belongsTo(AccionConstitucional::class, 'accion_id');
    }
}
