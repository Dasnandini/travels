export interface PlaceSearchResult {
  placeId: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export class GooglePlacesService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
  }

  async searchPlaces(query: string): Promise<PlaceSearchResult[]> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return [];
    }

    if (!this.apiKey) {
      console.warn("[GooglePlacesService]: GOOGLE_MAPS_SERVER_API_KEY is not configured.");
      return [];
    }

    try {
      const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
      url.searchParams.set("query", trimmedQuery);
      url.searchParams.set("key", this.apiKey);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error(`[GooglePlacesService]: HTTP error ${response.status}`);
        return [];
      }

      const data = await response.json();

      if (data.status !== "OK" || !Array.isArray(data.results)) {
        if (data.status !== "ZERO_RESULTS") {
          console.error(`[GooglePlacesService]: Places API returned status: ${data.status}`);
        }
        return [];
      }

      return data.results.map((item: any) => ({
        placeId: item.place_id || "",
        name: item.name || "",
        address: item.formatted_address || "",
        latitude: item.geometry?.location?.lat ?? null,
        longitude: item.geometry?.location?.lng ?? null,
      }));
    } catch (error) {
      console.error("[GooglePlacesService]: Error querying Google Places API", error);
      return [];
    }
  }
}

export const googlePlacesService = new GooglePlacesService();
