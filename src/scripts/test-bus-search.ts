import { calculateDurationMinutes, getWeekdayFromDateString, isPastDate, isValidDateString } from "../lib/date/date-utils";
import { busSearchService } from "../features/bus-search/bus-search.service";
import { busSearchSchema } from "../features/bus-search/bus-search.schema";
import { ApiError } from "../utils/api-error";
import { prisma } from "../lib/db/prisma";

async function runTests() {
  console.log("=========================================");
  console.log("RUNNING PRODUCTION BUS SEARCH API TESTS");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // --- 1. DATE UTILS TESTS ---
  console.log("--- 1. Testing Date & Time Utilities ---");
  assert(isValidDateString("2026-08-15") === true, "Valid date string '2026-08-15'");
  assert(isValidDateString("2026-02-31") === false, "Invalid calendar date '2026-02-31'");
  assert(isValidDateString("invalid") === false, "Invalid string format");

  // Weekday calculation
  // 2026-08-15 is Saturday
  assert(getWeekdayFromDateString("2026-08-15") === "SATURDAY", "2026-08-15 should be SATURDAY");
  // 2026-08-10 is Monday
  assert(getWeekdayFromDateString("2026-08-10") === "MONDAY", "2026-08-10 should be MONDAY");

  // Past date check
  assert(isPastDate("2026-08-01") === true, "2026-08-01 should be past date");
  assert(isPastDate("2026-08-15") === false, "2026-08-15 should not be past date");

  // Overnight duration calculation
  // 22:00 -> 07:00 => 540 minutes (9 hours)
  const dur1 = calculateDurationMinutes("22:00", "07:00");
  assert(dur1 === 540, `22:00 -> 07:00 duration should be 540 mins, got ${dur1}`);

  // 23:15 -> 07:00 => 465 minutes (7 hours 45 mins)
  const dur2 = calculateDurationMinutes("23:15", "07:00");
  assert(dur2 === 465, `23:15 -> 07:00 duration should be 465 mins, got ${dur2}`);

  // 01:10 -> 03:30 => 140 minutes (2 hours 20 mins)
  const dur3 = calculateDurationMinutes("01:10", "03:30");
  assert(dur3 === 140, `01:10 -> 03:30 duration should be 140 mins, got ${dur3}`);

  // --- 2. ZOD SCHEMA VALIDATION TESTS ---
  console.log("\n--- 2. Testing Zod Schema Validation ---");

  const validParsed = busSearchSchema.safeParse({
    from: "stop_bbsr",
    to: "stop_kol",
    date: "2026-08-15",
    passengers: "2",
    page: "1",
    limit: "20",
  });
  assert(validParsed.success === true, "Valid query parameter parsing");

  const missingFrom = busSearchSchema.safeParse({
    to: "stop_kol",
    date: "2026-08-15",
  });
  assert(missingFrom.success === false, "Missing 'from' parameter rejected");

  const invalidLimit = busSearchSchema.safeParse({
    from: "stop_bbsr",
    to: "stop_kol",
    date: "2026-08-15",
    limit: "100", // Max is 50
  });
  assert(invalidLimit.success === false, "Limit > 50 rejected");

  const invalidPassengers = busSearchSchema.safeParse({
    from: "stop_bbsr",
    to: "stop_kol",
    date: "2026-08-15",
    passengers: "0",
  });
  assert(invalidPassengers.success === false, "Passengers <= 0 rejected");

  // --- 3. SERVICE BUSINESS LOGIC TESTS ---
  console.log("\n--- 3. Testing Service Logic Edge Cases ---");

  // Same origin/destination test
  try {
    await busSearchService.searchBuses({
      from: "stop1",
      to: "stop1",
      date: "2026-08-15",
    });
    assert(false, "from === to should throw INVALID_SEARCH error");
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      assert(
        err.statusCode === 400 && err.code === "INVALID_SEARCH",
        "from === to throws 400 INVALID_SEARCH"
      );
    } else {
      assert(false, "from === to threw unexpected error type");
    }
  }

  // Past date test
  try {
    await busSearchService.searchBuses({
      from: "stop1",
      to: "stop2",
      date: "2026-08-01",
    });
    assert(false, "Past date should throw INVALID_DATE error");
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      assert(
        err.statusCode === 400 && err.code === "INVALID_DATE",
        "Past date throws 400 INVALID_DATE"
      );
    } else {
      assert(false, "Past date threw unexpected error type");
    }
  }

  // Non-existent stop test
  try {
    await busSearchService.searchBuses({
      from: "non_existent_stop_1",
      to: "non_existent_stop_2",
      date: "2026-08-15",
    });
    assert(false, "Non-existent stop should throw STOP_NOT_FOUND error");
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      assert(
        err.statusCode === 404 && err.code === "STOP_NOT_FOUND",
        "Non-existent stop throws 404 STOP_NOT_FOUND"
      );
    } else {
      assert(false, "Non-existent stop threw unexpected error type");
    }
  }

  console.log(`\n=========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
