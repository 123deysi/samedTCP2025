<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Municipio extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'departamento_id'];

    /**
     * Relación con el modelo Departamento.
     */
    public function departamento()
    {
        return $this->belongsTo(Departamentos::class);
    }
}
