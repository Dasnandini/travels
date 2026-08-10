import { RawBusServiceSearchResult } from "./bus-search.repository";
import { BusSearchResultItem } from "./bus-search.types";
import { calculateDurationMinutes } from "@/lib/date/date-utils";

export class BusSearchMapper {
  /**
   * Maps raw database service record into public customer-facing BusSearchResultItem.
   * Returns null if service does not satisfy sequence ordering or valid timetable times.
   */
  static mapToSearchResultItem(
    service: RawBusServiceSearchResult,
    fromStopId: string,
    toStopId: string,
    operatingDate: string
  ): BusSearchResultItem | null {
    const originStop = service.stops.find(
      (s: RawBusServiceSearchResult["stops"][number]) =>
        s.routeStop.stopId === fromStopId && s.boardingAllowed
    );
    const destinationStop = service.stops.find(
      (s: RawBusServiceSearchResult["stops"][number]) =>
        s.routeStop.stopId === toStopId && s.droppingAllowed
    );

    if (!originStop || !destinationStop) {
      return null;
    }

    // Ensure origin sequence comes before destination sequence (originSequence < destinationSequence)
    if (originStop.routeStop.sequence >= destinationStop.routeStop.sequence) {
      return null;
    }

    const departureTime = originStop.departureTime || originStop.arrivalTime;
    const arrivalTime = destinationStop.arrivalTime || destinationStop.departureTime;

    if (!departureTime || !arrivalTime) {
      return null;
    }

    const durationMinutes = calculateDurationMinutes(departureTime, arrivalTime);

    return {
      serviceId: service.id,
      serviceCode: service.serviceCode,
      serviceName: service.name,
      bus: {
        id: service.bus.id,
        busNumber: service.bus.busNumber,
        type: service.bus.type,
      },
      route: {
        id: service.route.id,
        name: service.route.name,
      },
      from: {
        stopId: originStop.routeStop.stop.id,
        name: originStop.routeStop.stop.name,
        city: originStop.routeStop.stop.city,
        departureTime,
      },
      to: {
        stopId: destinationStop.routeStop.stop.id,
        name: destinationStop.routeStop.stop.name,
        city: destinationStop.routeStop.stop.city,
        arrivalTime,
      },
      durationMinutes,
      operatingDate,
      availability: {
        status: "NOT_AVAILABLE_YET",
      },
    };
  }
}
