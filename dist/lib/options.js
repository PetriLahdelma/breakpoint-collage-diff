export function normalizeBreakpoints(input) {
    return [...new Set(input
            .split(",")
            .map(part => Number(part.trim()))
            .filter(value => Number.isInteger(value) && value > 0))].sort((a, b) => a - b);
}
export function normalizeUrls(urls) {
    const normalized = [];
    const seen = new Set();
    for (const url of urls) {
        assertHttpUrl(url);
        if (seen.has(url))
            continue;
        seen.add(url);
        normalized.push(url);
    }
    return normalized;
}
function assertHttpUrl(url) {
    let parsed;
    try {
        parsed = new URL(url);
    }
    catch {
        throw new Error(`Invalid URL: ${url}`);
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error(`Invalid URL protocol: ${url}`);
    }
}
//# sourceMappingURL=options.js.map