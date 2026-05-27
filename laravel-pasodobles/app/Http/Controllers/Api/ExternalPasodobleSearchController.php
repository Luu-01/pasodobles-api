<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExternalMusic\MusicBrainzService;
use Illuminate\Http\Request;
use Throwable;

class ExternalPasodobleSearchController extends Controller
{
    public function __construct(
        private readonly MusicBrainzService $musicBrainzService
    ) {}

    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required_without:q|nullable|string|min:2|max:100',
            'q' => 'required_without:query|nullable|string|min:2|max:100',
            'limit' => 'nullable|integer|min:1|max:25',
        ]);

        $query = $validated['query'] ?? $validated['q'];
        $limit = (int) ($validated['limit'] ?? 10);

        try {
            $results = $this->musicBrainzService->searchPasodobles($query, $limit);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'External music search is temporarily unavailable.',
                'data' => [],
            ], 502);
        }

        return response()->json([
            'data' => $results,
            'meta' => [
                'source' => 'musicbrainz',
                'query' => $query,
                'limit' => $limit,
                'count' => count($results),
            ],
        ]);
    }
}
