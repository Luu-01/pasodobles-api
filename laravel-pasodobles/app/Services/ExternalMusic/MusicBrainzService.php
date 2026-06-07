<?php

namespace App\Services\ExternalMusic;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class MusicBrainzService
{
    private const BASE_URL = 'https://musicbrainz.org/ws/2';

    public function searchPasodobles(string $query, int $limit = 10): array
    {
        $normalizedQuery = trim($query);
        $safeLimit = min(max($limit, 1), 25);
        $cacheKey = 'musicbrainz:pasodoble-search:' . sha1($normalizedQuery . ':' . $safeLimit);

        return Cache::remember($cacheKey, now()->addHours(6), function () use ($normalizedQuery, $safeLimit) {
            $response = Http::timeout(8)
                ->acceptJson()
                ->withHeaders([
                    // MusicBrainz requires clients to identify themselves. Keeping
                    // this call server-side centralizes that policy and avoids
                    // exposing third-party API details to Angular.
                    'User-Agent' => 'PasodoblesApi/1.0 (https://github.com/Luu-01/pasodobles-api)',
                ])
                ->get(self::BASE_URL . '/recording', [
                    'query' => $normalizedQuery . ' pasodoble',
                    'fmt' => 'json',
                    'limit' => $safeLimit,
                ]);

            if ($response->failed()) {
                throw new RuntimeException('MusicBrainz request failed.');
            }

            $recordings = $response->json('recordings', []);

            return collect($recordings)
                ->map(fn (array $recording) => $this->normalizeRecording($recording))
                ->values()
                ->all();
        });
    }

    private function normalizeRecording(array $recording): array
    {
        $artists = collect($recording['artist-credit'] ?? [])
            ->map(function (array $credit) {
                return $credit['artist']['name'] ?? $credit['name'] ?? null;
            })
            ->filter()
            ->values()
            ->all();

        $firstRelease = collect($recording['releases'] ?? [])
            ->pluck('date')
            ->filter()
            ->sort()
            ->first();

        return [
            'external_id' => $recording['id'] ?? null,
            'source' => 'musicbrainz',
            'type' => 'recording',
            'title' => $recording['title'] ?? null,
            'artist' => implode(', ', $artists),
            'score' => isset($recording['score']) ? (int) $recording['score'] : null,
            'first_release_date' => $firstRelease,
            'disambiguation' => $recording['disambiguation'] ?? null,
            'external_url' => isset($recording['id'])
                ? 'https://musicbrainz.org/recording/' . $recording['id']
                : null,
        ];
    }
}
