<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pasodoble;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class FavoritePasodobleController extends Controller
{
    private const PER_PAGE = 20;

    public function index(Request $request): JsonResponse
    {
        $favorites = $request->user()
            ->favoritePasodobles()
            ->with(['author', 'category'])
            ->latest('pasodoble_user_favorites.created_at')
            ->paginate(self::PER_PAGE);

        return $this->paginatedResponse($favorites);
    }

    public function toggle(Request $request, Pasodoble $pasodoble): JsonResponse
    {
        $user = $request->user();

        $result = $user->favoritePasodobles()->toggle($pasodoble->id);

        $isFavorite = count($result['attached']) > 0;

        return response()->json([
            'message' => $isFavorite
                ? 'Pasodoble added to favorites.'
                : 'Pasodoble removed from favorites.',
            'is_favorite' => $isFavorite,
            'pasodoble_id' => $pasodoble->id,
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
