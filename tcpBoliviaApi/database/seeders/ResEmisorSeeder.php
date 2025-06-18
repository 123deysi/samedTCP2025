<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Resolucion;
use League\Csv\Reader;
use Illuminate\Support\Facades\DB;

class ResEmisorSeeder extends Seeder
{
    public function run()
    {

        DB::table('res_emisores')->insert([
            [
                'nombre' => 'CA',
                'descripcion' => 'Comisión de Admisión',
            ],
            [
                'nombre' => 'SP1',
                'descripcion' => 'Sala particular 1',
            ],
            [
                'nombre' => 'SP2',
                'descripcion' => 'Sala particular 2',
            ],
            [
                'nombre' => 'SP3',
                'descripcion' => 'Sala particular 3',
            ],
            [
                'nombre' => 'SP4',
                'descripcion' => 'Sala particular 4',
            ],
            [
                'nombre' => 'SPL',
                'descripcion' => 'Sala Plena',
            ],
            [
                'nombre' => '97',
                'descripcion' => 'No aplicable',
            ],
            [
                'nombre' => '99',
                'descripcion' => 'Duda',
            ],
            [
                'nombre' => 'Otros',
                'descripcion' => null,
            ],
        ]);
    }
}