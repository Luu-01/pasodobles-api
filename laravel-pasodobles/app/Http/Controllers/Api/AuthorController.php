<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;

class AuthorController extends Controller
{
    public function index()
    {
        $authors = Author::all();
        
        return response()->json($authors);
    }

    public function show(Author $author)
    {
        if (!$author) {
            return response()->json(['message' => 'Compositor no encontrado'], 404);
        }
        // force pasodobles loading with the author
        $author->load('pasodobles');
        return response()->json($author);
    }
}
