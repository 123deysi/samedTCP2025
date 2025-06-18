<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class TiposResoluciones2Seeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tipos_resoluciones2')->insert([
            ['codigo' => '1', 'descripcion' => 'Resuelve el fondo de la causa'],
            ['codigo' => '2', 'descripcion' => 'Voto disidente o voto aclaratorio'],
            ['codigo' => '3', 'descripcion' => 'Resuelve la admision o rechazo de un reclamo'],
            ['codigo' => '4', 'descripcion' => 'Resuelve reclamo reclamo de complementacion o enmienda'],
            ['codigo' => '5', 'descripcion' => 'Otro'],
            ['codigo' => '97', 'descripcion' => 'No Aplicable'],
            ['codigo' => '99', 'descripcion' => 'Duda'],
            // Agrega más municipios de Potosí según corresponda
        ]);
    }
}
