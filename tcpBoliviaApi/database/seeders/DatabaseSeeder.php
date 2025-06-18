<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class, // agregado por Giancarlos
            DepartamentosSeeder::class,
            MunicipiosSeeder::class,
            AccionesConstitucionalesSeeder::class,
            SubtiposAccionesSeeder::class,
            TiposResoluciones2Seeder::class,
            TiposResolucionesSeeder::class,
            ResEmisorSeeder::class,
            ExcelDBRegistrosSeeder::class, 
        ]);
    }
}
