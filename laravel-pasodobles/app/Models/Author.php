<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Pasodoble;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Author extends Model
{
    /** @use HasFactory<\Database\Factories\AuthorFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'biography',
        'birth_year',
        'image_url',
    ];

    public function pasodobles(){
        return $this->hasMany(Pasodoble::class);
    }
}
