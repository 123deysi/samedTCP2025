<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    // Si el nombre de la tabla no es 'roles', puedes especificarlo aquí
    protected $table = 'roles';

    // Especifica qué campos pueden ser llenados masivamente
    protected $fillable = ['role'];

    // Si usas timestamps, deja esta propiedad; si no, configúralo a false.
    public $timestamps = true;

    /**
     * Relación con el modelo User
     */
    public function users()
    {
        return $this->hasMany(User::class);  // Un rol puede tener muchos usuarios
    }
}
