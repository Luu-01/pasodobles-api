<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class AuthorController extends Controller
{
    private const PER_PAGE = 20;

    public function index(): JsonResponse
    {
        $authors = Author::query()
            ->with([
                'pasodobles:id,title,description,year,author_id',
            ])
            ->select(['id', 'name', 'biography', 'birth_year', 'image_url'])
            ->orderBy('name')
            ->paginate(self::PER_PAGE);

        return $this->paginatedResponse($authors);
    }

    public function show(Author $author): JsonResponse
    {
        $author->load('pasodobles.author_id', 'pasodobles.category_id');
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

    private function paginatedResponse(LengthAwarePaginator $paginator): JsonResponse
    {
        return response()->json([
            'data' => $paginator->items(),
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'from' => $paginator->firstItem(),
                'last_page' => $paginator->lastPage(),
                'path' => $paginator->path(),
                'per_page' => $paginator->perPage(),
                'to' => $paginator->lastItem(),
                'total' => $paginator->total(),
            ],
        ]);
    }
}
