<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class TiposResolucionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tipos_resoluciones')->insert([
            ['codigo' => 'DCP', 'descripcion' =>'Declaración constitucional plurinacional resolviendo procedencia o improcedencia de CAI o CEA ','res_tipo2_id'=>1],
            ['codigo' => 'CDP', 'descripcion' =>'Declaración constitucional plurinacional resolviendo procedencia o improcedencia de CAI o CEA ','res_tipo2_id'=>1],
            ['codigo' => 'CA', 'descripcion' =>'Auto dictado por Comisión de Admisión. Auto constitucional de admisión o rechazo de acción de inconstitucionalidad (Acción abstracta, Acción concreta, Recurso de nulidad)','res_tipo2_id'=>3],
            ['codigo' => 'RCA', 'descripcion' =>'Auto constitucional acerca de la admisión o rechazo de acción de protección de garantías constitucionales (Amparo constitucional, Acción de Libertad, Acción de cumplimiento, etc.)','res_tipo2_id'=>3],
            ['codigo' => 'ECA', 'descripcion' => 'Auto constitucional que se pronuncia acerca de solicitud de enmienda o complementación, para AAC, ACU, AL, AP','res_tipo2_id'=>4],
            ['codigo' => 'O', 'descripcion' => 'Auto acerca de cumplimiento o incumplimiento de sentencia constitucional','res_tipo2_id'=>5],
            ['codigo' => 'RQ', 'descripcion' => 'Auto acerca de cumplimiento o incumplimiento de sentencia constitucional','res_tipo2_id'=>5],
            ['codigo' => 'SP', 'descripcion' => 'sentencia sala particualar ','res_tipo2_id'=>1],
            ['codigo' => 'SP1', 'descripcion' => 'sentencia sala particualar 1','res_tipo2_id'=>1],
            ['codigo' => 'SP2', 'descripcion' => 'sentencia sala particualar 2','res_tipo2_id'=>1],
            ['codigo' => 'SP3', 'descripcion' => 'sentencia sala particualar 3','res_tipo2_id'=>1],
            ['codigo' => 'SP4', 'descripcion' => 'sentencia sala particualar 4','res_tipo2_id'=>1],
            ['codigo' => 'SPL', 'descripcion' => 'Sentencia sala plena','res_tipo2_id'=>1],
         
        ]);
    }
}