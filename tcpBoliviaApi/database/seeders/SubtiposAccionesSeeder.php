<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class SubtiposAccionesSeeder extends Seeder
{
       /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
           //Accion de defensa
        DB::table('subtipos_acciones')->insert([
            ['nombre' => 'Acción de amparo constitucional','codigo' => 'AAC','accion_id' =>1],
            ['nombre' => 'Acción de libertad','codigo' => 'AL','accion_id' =>1],
            ['nombre' => 'Acción de cumplimiento','codigo' => 'ACU','accion_id' =>1],
            ['nombre' => 'Acción de popular','codigo' => 'AP','accion_id' =>1],
            ['nombre' => 'Acción de proteccion de privacidad','codigo' => 'APP','accion_id' =>1],
    
]);
         //Accion de inconstitucionalidad
         DB::table('subtipos_acciones')->insert([
            ['nombre' => 'Acción de inconstitucionalidad abstracta','codigo' => 'AIA','accion_id' =>2],
            ['nombre' => 'Acción de inconstitucionalidad concreta','codigo' => 'AIC','accion_id' =>2],
    
        ]);
         //Conflictos
         DB::table('subtipos_acciones')->insert([
            ['nombre' => 'Conflicto de Competencias Jurisdiccionales','codigo' => 'CCJ','accion_id' =>3],
            ['nombre' => 'Conflicto de compotencias entre el nivel central del estado y las entidades territoriales autonomas y entre estas','codigo' => 'CET','accion_id' =>3],
        ]);
         //Consultas
         DB::table('subtipos_acciones')->insert([
            ['nombre' => 'Consulta Autoridades Indígena Originaria  Campesinas sobre la aplicación de sus normas jurídicas a un 
caso concreto','codigo' => 'CAI','accion_id' =>4],

['nombre' => 'Consulta sobre la constitucionalidad de proyectos de ley','codigo' => 'CCP','accion_id' =>4],
['nombre' => 'Consulta sobre la constitucionalidad de proyectos de estatutos o cartas orgánicas de entidades territoriales 
autónomas ','codigo' => 'CEA','accion_id' =>4],
['nombre' => 'Consulta sobre la constitucionalidad de preguntas para referendo','codigo' => 'CPR','accion_id' =>4],

        ]);
         //Recurso
         DB::table('subtipos_acciones')->insert([
            ['nombre' => 'Recurso directo de nulidad','codigo' => 'RDN','accion_id' =>5],
            ['nombre' => 'Recurso contra resoluiones del Organo Legislativo','codigo' => 'RRL','accion_id' =>5],
            ['nombre' => 'Recurso contra tributos,impuestos tsas','codigo' => 'RTG','accion_id' =>5],
        ]);
    }
}
