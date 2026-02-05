export function slugifyUrl(url) {
    return url
        .replace(/^https?:\/\//, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}
//# sourceMappingURL=slug.js.map