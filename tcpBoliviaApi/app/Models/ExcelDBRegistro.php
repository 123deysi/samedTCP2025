<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExcelDBRegistro extends Model
{
    protected $table = 'excel_db_registros'; // Nombre de la tabla en la base de datos
    protected $fillable = [
        'numres2', 'res_fecha', 'res_tipo', 'res_tipo2', 'res_fondo_voto',
        'resresul', 'revresul', 'resfinal', 'relator', 'restiempo',
        'caso_id', 'sala', 'accion_const', 'accion_const2', 'res_emisor',
        'departamento_id', 'municipio_id', 'fecha_ingreso',
    ];

}
