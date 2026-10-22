// Makes the tab bars work. Tabs with the same title are selected together
// across the page, and the last choice is remembered.
const tabGroups = [...document.querySelectorAll(".tabs")];
const panels = (group) => [...group.querySelectorAll(":scope > .tab-panel")];
const tabs = (group) => [...group.querySelectorAll(":scope > .tab-list > button")];
const hasTab = (group, title) => panels(group).some((panel) => panel.dataset.title === title);

const selectTab = (group, title) => {
    for (const panel of panels(group)) {
        panel.hidden = panel.dataset.title !== title;
    }
    for (const tab of tabs(group)) {
        const selected = tab.textContent === title;
        tab.setAttribute("aria-selected", selected);
        tab.tabIndex = selected ? 0 : -1;
    }
};

const selectEverywhere = (title) => {
    for (const group of tabGroups) {
        if (hasTab(group, title)) selectTab(group, title);
    }
    try { localStorage.setItem("tab", title); } catch (_) {}
};

let savedTab = null;
try { savedTab = localStorage.getItem("tab"); } catch (_) {}

tabGroups.forEach((group, g) => {
    const list = group.querySelector(":scope > .tab-list");
    panels(group).forEach((panel, i) => {
        const tab = tabs(group)[i];
        tab.id = `tab-${g}-${i}`;
        panel.id = `tab-panel-${g}-${i}`;
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tab.id);
        tab.setAttribute("aria-controls", panel.id);
        tab.addEventListener("click", () => selectEverywhere(panel.dataset.title));
    });
    // Arrow keys, Home and End move between the tabs.
    list.addEventListener("keydown", (event) => {
        const all = tabs(group);
        const current = all.indexOf(document.activeElement);
        const moves = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: all.length - 1 };
        if (!(event.key in moves)) return;
        event.preventDefault();
        const tab = all[(moves[event.key] + all.length) % all.length];
        tab.focus();
        tab.click();
    });
    group.classList.add("ready");
    selectTab(group, hasTab(group, savedTab) ? savedTab : panels(group)[0].dataset.title);
});
