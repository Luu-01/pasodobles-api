<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
         $categories = [
            'Pascual Marquina',
            'Emilio Cebrián',
            'Manuel Penella',
            'José Serrano',
            'Ricardo Dorado',
            'Teo Aparicio',
            'José Franco',
            'Jaime Teixidor',
            'Abel Moreno',
            'Francisco Grau'
        ];

        return [
            'name' => fake()->randomElement($categories),
        ];
    }
}
