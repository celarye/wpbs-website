// The docs menu button, shown on small screens.
const menu = document.querySelector(".menu-toggle");

if (menu) {
    menu.addEventListener("click", () => {
        menu.setAttribute("aria-expanded", document.body.classList.toggle("menu-open"));
    });
}
