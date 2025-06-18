<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ExcelDBRegistrosSeeder extends Seeder
{
    /**
     * Ejecuta la siembra de la base de datos.
     *
     * @return void
     */
    public function run()
    {
        DB::table('excel_db_registros')->insert([
            [
                'numres2' => '12345',
                'res_fecha' => '2024-09-07',
                'res_tipo' => 'Tipo 1',
                'res_tipo2' => 'Tipo 2',
                'res_fondo_voto' => 10,
                'resresul' => 'Resultado 1',
                'revresul' => 'Resultado 2',
                'resfinal' => 'Final 1',
                'relator' => 'Relator 1',
                'restiempo' => 2.50,
                'caso_id' => 'Caso 1',
                'sala' => 'Sala 1',
                'accion_const' => 'Acción 1',
                'accion_const2' => 'Acción 2',
                'res_emisor' => 'Emisor 1',
                'departamento_id' => 'Departamento 1',
                'municipio_id' => 'Municipio 1',
                'fecha_ingreso' => '2024-09-07',
            ],
            // Puedes agregar más registros aquí
        ]);
    }
}
