<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pasodoble;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class PasodobleController extends Controller
{
    private const PER_PAGE = 20;

    public function index(): JsonResponse
    {
        $pasodobles = Pasodoble::query()
            ->with([
                'author:id,name,biography,birth_year,image_url',
                'category:id,name',
            ])
            ->select([
                'id',
                'title',
                'description',
                'year',
                'pdf_url',
                'author_id',
                'category_id',
                'created_at',
                'updated_at',
            ])
            ->orderBy('title')
            ->paginate(self::PER_PAGE);

        return $this->paginatedResponse($pasodobles);
    }

    public function show(Pasodoble $pasodoble): JsonResponse
    {
        $pasodoble->load('author', 'category');
        return response()->json($pasodoble);
    }

    public function store(Request $request): JsonResponse
    {
        //! replace by Resource
        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'year' => $request->year,
            'pdf_url' => $request->pdf_url,
            'author_id' => $request->author_id,
            'category_id' => $request->category_id,
        ];

        $pasodoble = Pasodoble::create($data);

        return response()->json([
            compact('pasodoble'),
            'message' => 'Created',
        ], 201);
    }

    public function update(Pasodoble $pasodoble, Request $request): JsonResponse
    {
        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'year' => $request->year,
            'pdf_url' => $request->pdf_url,
            'author_id' => $request->author_id,
            'category_id' => $request->category_id,
        ];

        $pasodoble->update($data);

        return response()->json([
            compact('pasodoble'),
            'message' => 'Updated',
        ]);
    }

    public function destroy(Pasodoble $pasodoble): JsonResponse
    {
        $pasodoble->delete();

        return response()->json([
            'message' => "Deleted pasodoble {$pasodoble->title}",
        ]);
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
