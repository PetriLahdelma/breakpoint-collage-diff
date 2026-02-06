import assert from "node:assert/strict";
import { slugifyUrl } from "../dist/lib/slug.js";

assert.equal(slugifyUrl("https://example.com/Hello World"), "example-com-hello-world");
assert.equal(slugifyUrl("https://example.com/page?a=1#frag"), "example-com-page-a-1-frag");
assert.equal(slugifyUrl("http://EXAMPLE.com///A__B"), "example-com-a-b");
console.log("slug.test.js ok");
