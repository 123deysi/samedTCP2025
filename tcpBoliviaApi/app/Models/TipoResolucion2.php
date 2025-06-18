<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoResolucion2 extends Model
{
    use HasFactory;

    protected $table = 'tipos_resoluciones2';

    protected $fillable = [

        'codigo',
        'nombre',
    ];
}
