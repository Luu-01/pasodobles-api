<?php

namespace Database\Factories;

use App\Models\Author;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class PasodobleFactory extends Factory
{
    public function definition(): array
    {
        $titles = [
            'Suspiros de España',
            'Paquito el Chocolatero',
            'Valencia en Fiesta',
            'Aires del Levante',
            'La Plaza Mayor',
            'Alma Mediterránea',
            'Brisas de Alicante',
            'Tradición Española',
            'Luz y Arena',
            'Fiesta en la Banda',
            'Tierra y Honor',
            'Caminos del Sur'
        ];

        return [
            'title' => fake()->randomElement($titles),

            'author_id' => Author::inRandomOrder()->first()?->id,

            'category_id' => Category::inRandomOrder()->first()?->id,

            'year' => fake()->numberBetween(1900,2020),

            'description' => fake()->paragraph(3)
        ];
    }
}
