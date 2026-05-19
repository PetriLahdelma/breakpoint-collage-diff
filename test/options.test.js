import assert from "node:assert/strict";
import { normalizeBreakpoints, normalizeUrls } from "../dist/lib/options.js";

assert.deepEqual(normalizeBreakpoints("1024, 375, 1024, 768"), [375, 768, 1024]);
assert.deepEqual(
  normalizeUrls(["https://example.com", "https://example.com", "http://example.org"]),
  ["https://example.com", "http://example.org"]
);
assert.throws(() => normalizeUrls(["ftp://example.com"]), /Invalid URL protocol/);
assert.throws(() => normalizeUrls(["not-a-url"]), /Invalid URL/);
console.log("options.test.js ok");
