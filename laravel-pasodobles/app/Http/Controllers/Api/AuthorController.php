<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;

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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:150'],
            'biography' => ['nullable', 'string', 'max:5000'],
            'birth_year' => ['nullable', 'integer', 'min:1000', 'max:' . now()->year],
            'image_url' => ['nullable', 'url', 'max:2048'],
        ]);

        $author = Author::create($validated);

        return response()->json($author, 201);
    }

    public function update(Request $request, Author $author)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:150'],
            'biography' => ['nullable', 'string', 'max:5000'],
            'birth_year' => ['nullable', 'integer', 'min:1000', 'max:' . now()->year],
            'image_url' => ['nullable', 'url', 'max:2048'],
        ]);

        $author->update($validated);

        return response()->json($author);
    }

    public function destroy(Author $author)
    {
        if ($author->pasodobles()->exists()) {
            return response()->json([
                'message' => 'No puedes eliminar un compositor que tiene pasodobles asociados.',
            ], 409);
        }

        $author->delete();

        return response()->json(null, 204);
    }
}
