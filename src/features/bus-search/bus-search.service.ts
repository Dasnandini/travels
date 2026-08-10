import { busSearchRepository, BusSearchRepository } from "./bus-search.repository";
import { BusSearchMapper } from "./bus-search.mapper";
import { BusSearchQueryParams, BusSearchResponseData, BusSearchResultItem } from "./bus-search.types";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "./bus-search.constants";
import { DEFAULT_TIMEZONE, getWeekdayFromDateString, isPastDate } from "@/lib/date/date-utils";
import { StopStatus } from "@/generated/prisma/enums";
import { ApiError } from "@/utils/api-error";

export class BusSearchService {
  constructor(private readonly repo: BusSearchRepository = busSearchRepository) {}

  /**
   * Search active bus services matching origin, destination, journey date, and passengers.
   */
  async searchBuses(params: BusSearchQueryParams): Promise<BusSearchResponseData> {
    const { from, to, date, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;

    // 1. Same origin and destination check
    if (from === to) {
      throw ApiError.badRequest("Origin and destination must be different.", "INVALID_SEARCH");
    }

    // 2. Past date check
    if (isPastDate(date, DEFAULT_TIMEZONE)) {
      throw ApiError.badRequest("Search date cannot be in the past.", "INVALID_DATE");
    }

    // 3. Check stop existence
    const stops = await this.repo.findStopsByIds(from, to);
    const originStop = stops.find((s) => s.id === from);
    const destinationStop = stops.find((s) => s.id === to);

    if (!originStop || !destinationStop) {
      throw ApiError.notFound("The selected stop could not be found.", "STOP_NOT_FOUND");
    }

    // 4. Inactive stop check - return empty data if either stop is INACTIVE
    if (originStop.status !== StopStatus.ACTIVE || destinationStop.status !== StopStatus.ACTIVE) {
      return {
        items: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    // 5. Determine weekday in configured timezone
    const weekday = getWeekdayFromDateString(date, DEFAULT_TIMEZONE);

    // 6. Query DB for candidate active services
    const candidateServices = await this.repo.findMatchingServices(from, to, weekday);

    // 7. Map and filter results (verifying sequence ordering and boarding/dropping permissions)
    const validItems: BusSearchResultItem[] = [];
    for (const service of candidateServices) {
      const item = BusSearchMapper.mapToSearchResultItem(service, from, to, date);
      if (item) {
        validItems.push(item);
      }
    }

    // 8. Sort by departureTime ASC
    validItems.sort((a, b) => {
      const [aH, aM] = a.from.departureTime.split(":").map(Number);
      const [bH, bM] = b.from.departureTime.split(":").map(Number);
      const timeDiff = aH * 60 + aM - (bH * 60 + bM);
      if (timeDiff !== 0) return timeDiff;
      return a.serviceCode.localeCompare(b.serviceCode);
    });

    // 9. Paginate results
    const total = validItems.length;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
    const startIndex = (page - 1) * limit;
    const paginatedItems = validItems.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}

export const busSearchService = new BusSearchService();
