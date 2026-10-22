// The dark mode toggle. applyTheme is defined inline in the page head, so the
// saved theme applies before the page is drawn.
const toggle = document.querySelector(".theme-toggle");
const root = document.documentElement;
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : systemDark.matches;
const updateToggle = () => toggle.setAttribute("aria-pressed", isDark());

updateToggle();
systemDark.addEventListener("change", updateToggle);
toggle.addEventListener("click", () => {
    const theme = isDark() ? "light" : "dark";
    root.classList.add("switching-theme");
    applyTheme(theme);
    // Applies the new colors now, while transitions are off.
    getComputedStyle(root).color;
    requestAnimationFrame(() => root.classList.remove("switching-theme"));
    try { localStorage.setItem("theme", theme); } catch (_) {}
    updateToggle();
});
