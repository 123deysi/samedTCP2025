<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Resolucion extends Model
{
    use HasFactory;

    protected $table = 'resoluciones';

    protected $fillable = [

        'numres2',
        'res_fecha',
        'res_tipo_id',
        'res_tipo2_id',
        'res_fondo',
        'resresul',
        'revresul',
        'resfinal',
        'relator',
        'restiempo',
        'caso_id',
    ];

    // Accesor para formatear la fecha cuando se lee desde el modelo
    // public function getFechaAttribute($value)
    // {
    //     return $value ? Carbon::parse($value)->format('d/m/Y') : null;
    // }

    // // Mutador para convertir la fecha a un formato específico antes de guardar
    // public function setFechaAttribute($value)
    // {
    //     $this->attributes['res_fecha'] = $value ? Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d') : null;
    // }

    // Accesor para manipular 'res_mes' si es necesario
    public function getResMesAttribute($value)
    {
        return $value ? Carbon::parse($value)->format('d/m/Y') : null;
    }

    // // Mutador para modificar 'res_mes' antes de guardarlo
    // public function setResMesAttribute($value)
    // {
    //     $this->attributes['res_mes'] = $value ? Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d') : null;
    // }

    public function tipoResolucion()
    {
        return $this->belongsTo(TipoResolucion::class, 'res_tipo_id');
    }

    public function tipoResolucion2()
    {
        return $this->belongsTo(TipoResolucion::class, 'res_tipo2_id');
    }

    public function caso()
    {
        return $this->belongsTo(Caso::class, 'caso_id');
    }
}
