<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index(): JsonResponse
    {
        $authors = Author::query()
            ->select(['id', 'name', 'biography', 'birth_year', 'image_url'])
            ->orderBy('name')
            ->get();
        
        return response()->json($authors);
    }

    public function show(Author $author): JsonResponse
    {
        $author->load('pasodobles.author', 'pasodobles.category');
        return response()->json($author);
    }

    public function store(Request $request): JsonResponse
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

    public function update(Request $request, Author $author): JsonResponse
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

    public function destroy(Author $author): JsonResponse
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
