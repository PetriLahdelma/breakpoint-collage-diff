import assert from "node:assert/strict";
import { slugifyUrl } from "../dist/lib/slug.js";

assert.equal(slugifyUrl("https://example.com/Hello World"), "example-com-hello-world");
console.log("slug.test.js ok");
