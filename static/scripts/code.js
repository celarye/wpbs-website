// Adds a header with the file name or language and a copy button to code blocks.
const svg = (paths) => `<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
const copyIcon = svg('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>');
const copiedIcon = svg('<path d="M5 12l5 5L20 7"/>');
const languages = { rust: "Rust", toml: "TOML", yaml: "YAML", wit: "WIT", shellscript: "Shell", powershell: "PowerShell", txt: "Text" };

for (const pre of document.querySelectorAll("pre[data-lang]")) {
    const header = document.createElement("div");
    header.className = "code-header";
    const label = document.createElement("span");
    label.textContent = pre.dataset.name || languages[pre.dataset.lang] || pre.dataset.lang;
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy";
    copy.title = "Copy";
    copy.setAttribute("aria-label", "Copy");
    copy.innerHTML = copyIcon;
    copy.addEventListener("click", async () => {
        await navigator.clipboard.writeText(pre.querySelector("code").innerText);
        copy.innerHTML = copiedIcon;
        setTimeout(() => (copy.innerHTML = copyIcon), 1500);
    });
    header.append(label, copy);
    const block = document.createElement("div");
    block.className = "code-block";
    pre.replaceWith(block);
    block.append(header, pre);
}
