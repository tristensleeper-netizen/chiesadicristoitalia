import { describe, test } from "node:test";
import { strictEqual } from "node:assert";
import { bolognaConfig } from "./cities";

describe("Bologna meeting location", () => {
  test("has no confirmed building or street address", () => {
    strictEqual(bolognaConfig.venueName, undefined);
    strictEqual(bolognaConfig.address, undefined);
    strictEqual(bolognaConfig.cap, undefined);
  });
  test("does not offer directions to an unconfirmed venue", () => {
    strictEqual(bolognaConfig.mapsUrl, undefined);
  });
  test("has no regular Sunday service time", () => {
    strictEqual(bolognaConfig.serviceTime, undefined);
  });
  test("uses the Bologna email for next gathering details", () => {
    strictEqual(bolognaConfig.email, "infobo@chiesadicristoitalia.it");
  });
});