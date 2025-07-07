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
    $adminRole = Role::firstOrCreate(['role' => 'Administrador']);
    $userRole = Role::firstOrCreate(['role' => 'Auxiliar']);

    User::firstOrCreate(
        ['email' => 'deysi@gmail.com'],
        [
            'name' => 'Deysi',
            'password' => Hash::make('deysi123'),
            'role_id' => $adminRole->id,
        ]
    );

    User::firstOrCreate(
        ['email' => 'danna@gmail.com'],
        [
            'name' => 'Danna',
            'password' => Hash::make('danna123'),
            'role_id' => $userRole->id,
        ]
    );
}

}
