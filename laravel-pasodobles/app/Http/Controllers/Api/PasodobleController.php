<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pasodoble;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class PasodobleController extends Controller
{
    private const PER_PAGE = 150;

    public function index(Request $request): JsonResponse
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
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search')->toString();

                $query->where(function ($subquery) use ($search) {
                    $subquery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('author', function ($authorQuery) use ($search) {
                            $authorQuery->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('category', function ($categoryQuery) use ($search) {
                            $categoryQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->whereHas('category', function ($categoryQuery) use ($request) {
                    $categoryQuery->where('name', $request->string('category')->toString());
                });
            })
            ->when($request->filled('author'), function ($query) use ($request) {
                $query->whereHas('author', function ($authorQuery) use ($request) {
                    $authorQuery->where('name', $request->string('author')->toString());
                });
            })
            ->orderBy('title')
            ->paginate(self::PER_PAGE)
            ->withQueryString();

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
