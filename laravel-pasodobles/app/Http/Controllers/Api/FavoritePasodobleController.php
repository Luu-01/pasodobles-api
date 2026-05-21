<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pasodoble;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoritePasodobleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $favorites = $request->user()
            ->favoritePasodobles()
            ->latest('pasodoble_user_favorites.created_at')
            ->get();

        return response()->json([
            'data' => $favorites,
        ]);
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
}

