<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartamentosSeeder extends Seeder
{
    public function run()
    {
        DB::table('departamentos')->insert([
            ['nombre' => 'La Paz'],
            ['nombre' => 'Oruro'],
            ['nombre' => 'Potosí'],
            ['nombre' => 'Tarija'],
            ['nombre' => 'Santa Cruz'],
            ['nombre' => 'Chuquisaca'],
            ['nombre' => 'Pando'],
            ['nombre' => 'Beni'],
            ['nombre' => 'Cochabamba'],
        ]);
    }
}
