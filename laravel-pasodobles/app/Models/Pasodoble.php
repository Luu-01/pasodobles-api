<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Pasodoble extends Model
{
    /** @use HasFactory<\Database\Factories\PasodobleFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'year',
        'pdf_url',
        'author_id',
        'category_id',
    ];

    protected $casts = [
        'year' => 'date',
    ];

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function favoritedByUsers()
    {
        return $this->belongsToMany(
            User::class,
            'pasodoble_user_favorites'
        )->withTimestamps();
    }
    
}
