import { prisma } from "../lib/db/prisma";
import { busSearchService } from "../features/bus-search/bus-search.service";
import { StopStatus, RouteStatus, BusStatus, BusType, ServiceStatus, Weekday } from "../generated/prisma/enums";

async function runE2ETests() {
  console.log("=========================================");
  console.log("RUNNING BUS SEARCH E2E INTEGRATION TESTS");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
      failed++;
    }
  }

  // Identifiers for test setup
  const PREFIX = "TEST_E2E_SEARCH_";
  
  try {
    // Clean up any old test data if left over
    await prisma.busService.deleteMany({ where: { serviceCode: { startsWith: PREFIX } } });
    await prisma.bus.deleteMany({ where: { busNumber: { startsWith: PREFIX } } });
    await prisma.route.deleteMany({ where: { code: { startsWith: PREFIX } } });
    await prisma.stop.deleteMany({ where: { name: { startsWith: PREFIX } } });

    // 1. Create Test Stops
    const stopBbsr = await prisma.stop.create({
      data: {
        name: `${PREFIX}Bhubaneswar`,
        city: "Bhubaneswar",
        state: "Odisha",
        status: StopStatus.ACTIVE,
      },
    });

    const stopCuttack = await prisma.stop.create({
      data: {
        name: `${PREFIX}Cuttack`,
        city: "Cuttack",
        state: "Odisha",
        status: StopStatus.ACTIVE,
      },
    });

    const stopJajpur = await prisma.stop.create({
      data: {
        name: `${PREFIX}Jajpur`,
        city: "Jajpur",
        state: "Odisha",
        status: StopStatus.ACTIVE,
      },
    });

    const stopBalasore = await prisma.stop.create({
      data: {
        name: `${PREFIX}Balasore`,
        city: "Balasore",
        state: "Odisha",
        status: StopStatus.ACTIVE,
      },
    });

    const stopKol = await prisma.stop.create({
      data: {
        name: `${PREFIX}Kolkata`,
        city: "Kolkata",
        state: "West Bengal",
        status: StopStatus.ACTIVE,
      },
    });

    const stopPuriInactive = await prisma.stop.create({
      data: {
        name: `${PREFIX}Puri`,
        city: "Puri",
        state: "Odisha",
        status: StopStatus.INACTIVE,
      },
    });

    // 2. Create Test Route
    const route = await prisma.route.create({
      data: {
        name: `${PREFIX}BBSR-KOL Route`,
        code: `${PREFIX}ROUTE_001`,
        status: RouteStatus.ACTIVE,
        stops: {
          create: [
            { stopId: stopBbsr.id, sequence: 1 },
            { stopId: stopCuttack.id, sequence: 2 },
            { stopId: stopJajpur.id, sequence: 3 },
            { stopId: stopBalasore.id, sequence: 4 },
            { stopId: stopKol.id, sequence: 5 },
          ],
        },
      },
      include: {
        stops: true,
      },
    });

    // 3. Create Test Bus
    const bus = await prisma.bus.create({
      data: {
        busNumber: `${PREFIX}BUS_001`,
        registrationNumber: `${PREFIX}REG_001`,
        name: "Muskan Express Bus",
        type: BusType.SLEEPER,
        status: BusStatus.ACTIVE,
      },
    });

    // Map routeStops by stopId
    const routeStopMap = new Map<string, string>();
    for (const rs of route.stops) {
      routeStopMap.set(rs.stopId, rs.id);
    }

    // 4. Create Test Bus Service
    const busService = await prisma.busService.create({
      data: {
        serviceCode: `${PREFIX}SRV_001`,
        name: "Bhubaneswar - Kolkata Express",
        busId: bus.id,
        routeId: route.id,
        status: ServiceStatus.ACTIVE,
        operatingDays: {
          create: [
            { day: Weekday.MONDAY },
            { day: Weekday.WEDNESDAY },
            { day: Weekday.FRIDAY },
            { day: Weekday.SATURDAY },
          ],
        },
        stops: {
          create: [
            {
              routeStopId: routeStopMap.get(stopBbsr.id)!,
              departureTime: "22:00",
              arrivalTime: null,
              boardingAllowed: true,
              droppingAllowed: false,
            },
            {
              routeStopId: routeStopMap.get(stopCuttack.id)!,
              arrivalTime: "23:00",
              departureTime: "23:15",
              boardingAllowed: true,
              droppingAllowed: true,
            },
            {
              routeStopId: routeStopMap.get(stopJajpur.id)!,
              arrivalTime: "01:00",
              departureTime: "01:10",
              boardingAllowed: true,
              droppingAllowed: true,
            },
            {
              routeStopId: routeStopMap.get(stopBalasore.id)!,
              arrivalTime: "03:30",
              departureTime: "03:50",
              boardingAllowed: true,
              droppingAllowed: true,
            },
            {
              routeStopId: routeStopMap.get(stopKol.id)!,
              arrivalTime: "07:00",
              departureTime: null,
              boardingAllowed: false,
              droppingAllowed: true,
            },
          ],
        },
      },
    });

    console.log("--- Setup test data complete ---");

    // TEST 1: Bhubaneswar -> Kolkata on 2026-08-15 (Saturday - operating day)
    const result1 = await busSearchService.searchBuses({
      from: stopBbsr.id,
      to: stopKol.id,
      date: "2026-08-15",
    });
    assert(result1.items.length === 1, "Bhubaneswar -> Kolkata returns 1 service");
    if (result1.items.length > 0) {
      const item = result1.items[0];
      assert(item.from.departureTime === "22:00", "Bhubaneswar departure is 22:00");
      assert(item.to.arrivalTime === "07:00", "Kolkata arrival is 07:00");
      assert(item.durationMinutes === 540, "Overnight duration BBSR -> KOL is 540 mins (9h)");
    }

    // TEST 2: Cuttack -> Kolkata on 2026-08-15
    const result2 = await busSearchService.searchBuses({
      from: stopCuttack.id,
      to: stopKol.id,
      date: "2026-08-15",
    });
    assert(result2.items.length === 1, "Cuttack -> Kolkata returns 1 service");
    if (result2.items.length > 0) {
      const item = result2.items[0];
      assert(item.from.departureTime === "23:15", "Cuttack departure is 23:15");
      assert(item.to.arrivalTime === "07:00", "Kolkata arrival is 07:00");
      assert(item.durationMinutes === 465, "Duration Cuttack -> KOL is 465 mins (7h 45m)");
    }

    // TEST 3: Jajpur -> Balasore on 2026-08-15
    const result3 = await busSearchService.searchBuses({
      from: stopJajpur.id,
      to: stopBalasore.id,
      date: "2026-08-15",
    });
    assert(result3.items.length === 1, "Jajpur -> Balasore returns 1 service");
    if (result3.items.length > 0) {
      const item = result3.items[0];
      assert(item.from.departureTime === "01:10", "Jajpur departure is 01:10");
      assert(item.to.arrivalTime === "03:30", "Balasore arrival is 03:30");
      assert(item.durationMinutes === 140, "Duration Jajpur -> Balasore is 140 mins (2h 20m)");
    }

    // TEST 4: Reverse direction (Kolkata -> Cuttack)
    const resultReverse = await busSearchService.searchBuses({
      from: stopKol.id,
      to: stopCuttack.id,
      date: "2026-08-15",
    });
    assert(resultReverse.items.length === 0, "Reverse search Kolkata -> Cuttack returns 0 services");

    // TEST 5: Non-operating day (2026-08-11 is Tuesday, service operates Mon/Wed/Fri/Sat)
    const resultTue = await busSearchService.searchBuses({
      from: stopBbsr.id,
      to: stopKol.id,
      date: "2026-08-11",
    });
    assert(resultTue.items.length === 0, "Tuesday (non-operating day) search returns 0 services");

    // TEST 6: Inactive stop search (from PuriInactive)
    const resultInactiveStop = await busSearchService.searchBuses({
      from: stopPuriInactive.id,
      to: stopKol.id,
      date: "2026-08-15",
    });
    assert(resultInactiveStop.items.length === 0, "Inactive stop search returns empty list (0 items)");

  } finally {
    // Clean up test data
    await prisma.busService.deleteMany({ where: { serviceCode: { startsWith: PREFIX } } });
    await prisma.bus.deleteMany({ where: { busNumber: { startsWith: PREFIX } } });
    await prisma.route.deleteMany({ where: { code: { startsWith: PREFIX } } });
    await prisma.stop.deleteMany({ where: { name: { startsWith: PREFIX } } });
  }

  console.log(`\n=========================================`);
  console.log(`E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ETests()
  .catch((e) => {
    console.error("E2E Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
