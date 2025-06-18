<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MunicipiosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // La Paz
        DB::table('municipios')->insert([
            ['nombre' => 'Capital', 'departamento_id' => 1],
            ['nombre' => 'El Alto', 'departamento_id' => 1],
            ['nombre' => 'Achocalla', 'departamento_id' => 1],
            ['nombre' => 'Viacha', 'departamento_id' => 1],
            ['nombre' => 'Laja', 'departamento_id' => 1],
            ['nombre' => 'Mecapaca', 'departamento_id' => 1],
            ['nombre' => 'Palca', 'departamento_id' => 1],
            ['nombre' => 'Pucarani', 'departamento_id' => 1],
            ['nombre' => 'Patacamaya', 'departamento_id' => 1],
            ['nombre' => 'Sica Sica', 'departamento_id' => 1],
            ['nombre' => 'Coroico', 'departamento_id' => 1],
            ['nombre' => 'Cairoma', 'departamento_id' => 1],
            ['nombre' => 'Sapahaqui', 'departamento_id' => 1],
            ['nombre' => 'Patacamaya', 'departamento_id' => 1],
            ['nombre' => 'Achocalla', 'departamento_id' => 1],
            // Agrega más municipios de La Paz según corresponda
        ]);

        // Oruro
        DB::table('municipios')->insert([
            ['nombre' => 'Capital', 'departamento_id' => 2],
            ['nombre' => 'Huanuni', 'departamento_id' => 2],
            ['nombre' => 'Caracollo', 'departamento_id' => 2],
            ['nombre' => 'Eucaliptus', 'departamento_id' => 2],
            ['nombre' => 'Machacamarca', 'departamento_id' => 2],
            ['nombre' => 'Poopó', 'departamento_id' => 2],
            ['nombre' => 'Sajama', 'departamento_id' => 2],
            ['nombre' => 'Salinas de Garci Mendoza', 'departamento_id' => 2],
            ['nombre' => 'Pampa Aullagas', 'departamento_id' => 2],
            ['nombre' => 'Totora', 'departamento_id' => 2],
            ['nombre' => 'Orinoca', 'departamento_id' => 2],
            // Agrega más municipios de Oruro según corresponda
        ]);

        // Potosí
        DB::table('municipios')->insert([
            ['nombre' => 'Capital', 'departamento_id' => 3],
            ['nombre' => 'Uyuni', 'departamento_id' => 3],
            ['nombre' => 'Villazón', 'departamento_id' => 3],
            ['nombre' => 'Colcha K', 'departamento_id' => 3],
            ['nombre' => 'Atocha', 'departamento_id' => 3],
            ['nombre' => 'Tupiza', 'departamento_id' => 3],
            ['nombre' => 'San Pedro de Quemes', 'departamento_id' => 3],
            ['nombre' => 'San Pablo de Lípez', 'departamento_id' => 3],
            ['nombre' => 'Puna', 'departamento_id' => 3],
            ['nombre' => 'Cotagaita', 'departamento_id' => 3],
            ['nombre' => 'Tomave', 'departamento_id' => 3],
            ['nombre' => 'Betanzos', 'departamento_id' => 3],
            ['nombre' => 'Acasio', 'departamento_id' => 3],
            // Agrega más municipios de Potosí según corresponda
        ]);

        // Tarija
        DB::table('municipios')->insert([
            ['nombre' => 'Capital', 'departamento_id' => 4],
            ['nombre' => 'Yacuiba', 'departamento_id' => 4],
            ['nombre' => 'Bermejo', 'departamento_id' => 4],
            ['nombre' => 'Villa Montes', 'departamento_id' => 4],
            ['nombre' => 'Entre Ríos', 'departamento_id' => 4],
            ['nombre' => 'Padcaya', 'departamento_id' => 4],
            ['nombre' => 'San Lorenzo', 'departamento_id' => 4],
            ['nombre' => 'El Puente', 'departamento_id' => 4],
            ['nombre' => 'Caraparí', 'departamento_id' => 4],
            ['nombre' => 'Yunchará', 'departamento_id' => 4],
            // Agrega más municipios de Tarija según corresponda
        ]);

        // Santa Cruz
        DB::table('municipios')->insert([
            ['nombre' => 'Capital', 'departamento_id' => 5],
            ['nombre' => 'Montero', 'departamento_id' => 5],
            ['nombre' => 'Cotoca', 'departamento_id' => 5],
            ['nombre' => 'La Guardia', 'departamento_id' => 5],
            ['nombre' => 'Warnes', 'departamento_id' => 5],
            ['nombre' => 'San Ignacio de Velasco', 'departamento_id' => 5],
            ['nombre' => 'Roboré', 'departamento_id' => 5],
            ['nombre' => 'San José de Chiquitos', 'departamento_id' => 5],
            ['nombre' => 'Puerto Quijarro', 'departamento_id' => 5],
            ['nombre' => 'Concepción', 'departamento_id' => 5],
            ['nombre' => 'El Torno', 'departamento_id' => 5],
            ['nombre' => 'San Julián', 'departamento_id' => 5],
            ['nombre' => 'Camiri', 'departamento_id' => 5],
            ['nombre' => 'Puerto Suárez', 'departamento_id' => 5],
            ['nombre' => 'Vallegrande', 'departamento_id' => 5],
            ['nombre' => 'Ascensión de Guarayos', 'departamento_id' => 5],
            // Agrega más municipios de Santa Cruz según corresponda
        ]);

        // Chuquisaca
        DB::table('municipios')->insert([
            ['nombre' => 'Capital', 'departamento_id' => 6],
            ['nombre' => 'Camargo', 'departamento_id' => 6],
            ['nombre' => 'Monteagudo', 'departamento_id' => 6],
            ['nombre' => 'Tarabuco', 'departamento_id' => 6],
            ['nombre' => 'Padilla', 'departamento_id' => 6],
            ['nombre' => 'Villa Serrano', 'departamento_id' => 6],
            ['nombre' => 'Icla', 'departamento_id' => 6],
            ['nombre' => 'Zudáñez', 'departamento_id' => 6],
            ['nombre' => 'Presto', 'departamento_id' => 6],
            ['nombre' => 'San Lucas', 'departamento_id' => 6],
            ['nombre' => 'Incahuasi', 'departamento_id' => 6],
            ['nombre' => 'Tomina', 'departamento_id' => 6],
            ['nombre' => 'Villa Charcas', 'departamento_id' => 6],
            // Agrega más municipios de Chuquisaca según corresponda
        ]);

        // Pando
        DB::table('municipios')->insert([
            ['nombre' => 'Capital', 'departamento_id' => 7],
            ['nombre' => 'Porvenir', 'departamento_id' => 7],
            ['nombre' => 'Bolpebra', 'departamento_id' => 7],
            ['nombre' => 'Filadelfia', 'departamento_id' => 7],
            ['nombre' => 'Puerto Rico', 'departamento_id' => 7],
            ['nombre' => 'Bella Flor', 'departamento_id' => 7],
            ['nombre' => 'Sena', 'departamento_id' => 7],
            ['nombre' => 'Santa Rosa del Abuná', 'departamento_id' => 7],
            ['nombre' => 'Ingavi', 'departamento_id' => 7],
            ['nombre' => 'Nueva Esperanza', 'departamento_id' => 7],
            // Agrega más municipios de Pando según corresponda
        ]);

        // Beni
        DB::table('municipios')->insert([
            ['nombre' => 'Capital', 'departamento_id' => 8],
            ['nombre' => 'Riberalta', 'departamento_id' => 8],
            ['nombre' => 'Guayaramerín', 'departamento_id' => 8],
            ['nombre' => 'San Borja', 'departamento_id' => 8],
            ['nombre' => 'Reyes', 'departamento_id' => 8],
            ['nombre' => 'Santa Ana del Yacuma', 'departamento_id' => 8],
            ['nombre' => 'Rurrenabaque', 'departamento_id' => 8],
            ['nombre' => 'Magdalena', 'departamento_id' => 8],
            ['nombre' => 'San Ignacio de Moxos', 'departamento_id' => 8],
            ['nombre' => 'San Ramón', 'departamento_id' => 8],
            ['nombre' => 'San Joaquín', 'departamento_id' => 8],
            ['nombre' => 'Loreto', 'departamento_id' => 8],
            // Agrega más municipios de Beni según corresponda
        ]);

        // Cochabamba
        DB::table('municipios')->insert([
            ['nombre' => 'Capital', 'departamento_id' => 9],
            ['nombre' => 'Quillacollo', 'departamento_id' => 9],
            ['nombre' => 'Sacaba', 'departamento_id' => 9],
            ['nombre' => 'Punata', 'departamento_id' => 9],
            ['nombre' => 'Cliza', 'departamento_id' => 9],
            ['nombre' => 'Tiquipaya', 'departamento_id' => 9],
            ['nombre' => 'Vinto', 'departamento_id' => 9],
            ['nombre' => 'Sipe Sipe', 'departamento_id' => 9],
            ['nombre' => 'Capinota', 'departamento_id' => 9],
            ['nombre' => 'Arani', 'departamento_id' => 9],
            ['nombre' => 'Arque', 'departamento_id' => 9],
            ['nombre' => 'Tapacarí', 'departamento_id' => 9],
            ['nombre' => 'Bolívar', 'departamento_id' => 9],
            ['nombre' => 'Arbieto', 'departamento_id' => 9],
            ['nombre' => 'San Benito', 'departamento_id' => 9],
            // Agrega más municipios de Cochabamba según corresponda
        ]);
    }
}


