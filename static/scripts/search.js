// The search dialog, opened with the search button or Ctrl/Cmd+K.
const searchButton = document.querySelector(".search-button");
const searchModal = document.querySelector(".search-modal");
const searchInput = searchModal.querySelector(".search-input");
const searchResults = searchModal.querySelector(".search-results");
let indexPromise;
let activeResult = -1;
let returnFocus = null;

const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
});

// The index holds every page's text, so it only loads once search is used.
const loadIndex = () => indexPromise ??= (async () => {
    await loadScript(searchModal.dataset.index);
    const pages = window.searchIndex.filter((page) => page.title);
    return { pages, byUrl: new Map(pages.map((page) => [page.url, page])) };
})();

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Matches the search words at the start of a word, so partial words match too.
// Longer words come first, so they win over words they start with.
const wordStarts = (words) => {
    const alternatives = [...words].sort((a, b) => b.length - a.length).map(escapeRegExp);
    return new RegExp(`(?<![\\p{L}\\p{N}])(${alternatives.join("|")})`, "giu");
};

// Takes one pattern per search word, built once for all pages.
const score = (page, patterns, query) => {
    let total = page.title.toLowerCase() === query ? 100 : 0;
    for (const pattern of patterns) {
        const inTitle = (page.title.match(pattern) || []).length;
        const inBody = (page.body.match(pattern) || []).length;
        if (!inTitle && !inBody) return 0;
        total += inTitle * 20 + Math.min(inBody, 10);
    }
    return total;
};

// Adds text to an element, marking the parts that match a search word. Splitting
// on the pattern puts the matches at the odd positions.
const highlight = (element, text, words) => {
    text.split(wordStarts(words)).forEach((part, i) => {
        if (!part) return;
        if (i % 2) {
            const mark = document.createElement("mark");
            mark.textContent = part;
            element.append(mark);
        } else {
            element.append(part);
        }
    });
};

// A part of the text around the first match, cut at word boundaries.
const excerpt = (body, words) => {
    body = body.replace(/\s+/g, " ").trim();
    const hit = body.search(wordStarts(words));
    let start = hit > 0 ? Math.max(0, hit - 50) : 0;
    if (start > 0) start = body.indexOf(" ", start) + 1;
    let end = Math.min(body.length, start + 150);
    if (end < body.length) end = body.lastIndexOf(" ", end);
    return (start > 0 ? "…" : "") + body.slice(start, end) + (end < body.length ? "…" : "");
};

// The titles of the sections a page is in, from its URL.
const sectionPath = (index, address) => {
    const url = new URL(address);
    const parts = url.pathname.split("/").filter(Boolean);
    const titles = [];
    for (let i = 2; i < parts.length; i++) {
        const parent = index.byUrl.get(new URL(`/${parts.slice(0, i).join("/")}/`, url).href);
        if (parent && parent.title) titles.push(parent.title);
    }
    return titles.join(" › ");
};

const message = (text) => {
    const item = document.createElement("li");
    item.className = "search-message";
    item.textContent = text;
    return item;
};

const resultLinks = () => [...searchResults.querySelectorAll("a")];

const setActive = (position) => {
    const links = resultLinks();
    if (!links.length) return;
    activeResult = (position + links.length) % links.length;
    links.forEach((link, i) => link.classList.toggle("active", i === activeResult));
    links[activeResult].scrollIntoView({ block: "nearest" });
};

const showResults = async () => {
    const query = searchInput.value.trim();
    activeResult = -1;
    if (!query) {
        searchResults.replaceChildren(message("Type to search the docs."));
        return;
    }
    const index = await loadIndex();
    if (searchInput.value.trim() !== query) return;
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const patterns = words.map((word) => wordStarts([word]));
    const results = index.pages
        .map((page) => ({ page, score: score(page, patterns, query.toLowerCase()) }))
        .filter((result) => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((result) => result.page);
    if (!results.length) {
        searchResults.replaceChildren(message(`No results for “${query}”.`));
        return;
    }
    searchResults.replaceChildren(...results.map((doc) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = doc.url;
        const path = sectionPath(index, doc.url);
        if (path) {
            const where = document.createElement("span");
            where.className = "search-path";
            where.textContent = path;
            link.append(where);
        }
        const title = document.createElement("strong");
        highlight(title, doc.title, words);
        const text = document.createElement("span");
        text.className = "search-excerpt";
        highlight(text, excerpt(doc.body, words), words);
        link.append(title, text);
        item.append(link);
        return item;
    }));
    setActive(0);
};

const openSearch = () => {
    returnFocus = document.activeElement;
    searchModal.hidden = false;
    document.body.classList.add("search-open");
    searchInput.focus();
    searchInput.select();
    showResults();
};

const closeSearch = () => {
    searchModal.hidden = true;
    document.body.classList.remove("search-open");
    returnFocus?.focus();
};

searchButton.addEventListener("click", openSearch);
searchModal.querySelector(".search-backdrop").addEventListener("click", closeSearch);
searchModal.querySelector(".search-close").addEventListener("click", closeSearch);
searchInput.addEventListener("input", showResults);
searchResults.addEventListener("mousemove", (event) => {
    const link = event.target.closest("a");
    if (link) setActive(resultLinks().indexOf(link));
});
searchModal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSearch();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setActive(activeResult + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Enter" && resultLinks()[activeResult]) {
        event.preventDefault();
        location.href = resultLinks()[activeResult].href;
    } else if (event.key === "Tab") {
        event.preventDefault();
        searchInput.focus();
    }
});
document.addEventListener("keydown", (event) => {
    if (!searchModal.hidden) return;
    if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openSearch();
    }
});
