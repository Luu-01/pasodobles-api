<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AuthorFactory extends Factory
{
    public function definition(): array
    {
        $authors = [
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
            'name' => fake()->randomElement($authors),
            'birth_year' => fake()->numberBetween(1850, 1970),
            'biography' => fake()->paragraph(),
        ];
    }
}
