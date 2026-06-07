<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin account

        User::create([
            'name' => 'Valeria',
            'email' => 'valeria@gmail.com',
            'password' => Hash::make('valeria'),
            'role' => 'admin',
        ]);

    }
}
