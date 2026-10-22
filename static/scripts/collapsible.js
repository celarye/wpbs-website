// Opens a collapsible when a link points to it or to something inside it.
const openTarget = () => {
    let target = null;
    try {
        target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    } catch (_) {
        return;
    }
    const details = target && target.closest("details");
    if (details && !details.open) {
        details.open = true;
        target.scrollIntoView();
    }
};

openTarget();
addEventListener("hashchange", openTarget);
