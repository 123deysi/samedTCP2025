<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\SubtipoAccion;

class AccionConstitucional extends Model
{
    use HasFactory;

    protected $table = 'acciones_constitucionales';

    protected $fillable = ['nombre'];
     public function subtipos()
    {
        return $this->hasMany(SubtipoAccion::class, 'accion_id');
    }
}
