import { describe, expect, test } from "bun:test";
import { bolognaConfig } from "./cities";

describe("Bologna meeting location", () => {
  test("has no confirmed building or street address", () => {
    expect(bolognaConfig.venueName).toBeUndefined();
    expect(bolognaConfig.address).toBeUndefined();
    expect(bolognaConfig.cap).toBeUndefined();
  });
  test("does not offer directions to an unconfirmed venue", () => {
    expect(bolognaConfig.mapsUrl).toBeUndefined();
  });
});