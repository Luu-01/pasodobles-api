export interface ExternalPasodobleResult {
  external_id: string | null;
  source: 'musicbrainz';
  type: 'recording';
  title: string | null;
  artist: string;
  score: number | null;
  first_release_date: string | null;
  disambiguation: string | null;
  external_url: string | null;
}

export interface ExternalPasodobleSearchResponse {
  data: ExternalPasodobleResult[];
  meta: {
    source: 'musicbrainz';
    query: string;
    limit: number;
    count: number;
  };
}
