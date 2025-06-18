<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {        
        // Asegúrate de que los roles existan o créalos si no existen
        $adminRole = Role::firstOrCreate(['role' => 'Administrador']);
        $userRole = Role::firstOrCreate(['role' => 'Auxiliar']);

        
        User::create([
            'name' => 'Deysi',
            'email' => 'deysi@gmail.com',
            'password' => Hash::make('deysi123'),
            'role_id' => $adminRole->id,
        ]);
        User::create([
            'name' => 'Danna',
            'email' => 'danna@gmail.com',
            'password' => Hash::make('danna123'),
            'role_id' => $userRole->id,
        ]);
    }
}
