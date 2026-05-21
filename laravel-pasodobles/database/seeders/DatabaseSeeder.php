<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Category;
use App\Models\Pasodoble;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin account

        $admin = User::create([
            'name' => 'Valeria',
            'email' => 'valeria@gmail.com',
            'password' => Hash::make('valeria'),
            'role' => 'admin',
        ]);

        // Optional regular users

        User::factory(10)->create();

        // Music data

        Author::factory(8)->create();

        Category::factory()->createMany([
            ['name'=>'Pasodoble Taurino'],
            ['name'=>'Pasodoble Militar'],
            ['name'=>'Pasodoble Festero'],
            ['name'=>'Pasodoble Procesional'],
            ['name'=>'Pasodoble Popular']
        ]);

        Pasodoble::factory(25)->create();

        // Random favorites for testing

        $pasodobles = Pasodoble::all();

        $admin->favoritePasodobles()->syncWithoutDetaching(
            $pasodobles->random(5)->pluck('id')->toArray()
        );  

        User::where('id', '!=', $admin->id)->each(function ($user) use ($pasodobles) {
            /** @var User $user  */
            $user->favoritePasodobles()->syncWithoutDetaching(
                $pasodobles->random(rand(1, 5))->pluck('id')->toArray()
            );
        });
    }
}
