const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

document.addEventListener('DOMContentLoaded', () => {
  const sidebarState = localStorage.getItem('sidebarState')

  if (sidebarState === 'closed') {
    sidebar.classList.add('close')
    toggleButton.classList.add('rotate')
  }
  
  sidebar.style.visibility = 'visible'
})

function toggleSidebar(){
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')

  localStorage.setItem(
    'sidebarState',
    sidebar.classList.contains('close') ? 'closed' : 'open'
  )

  closeAllSubMenus()
}

function toggleSubMenu(button){

  const isMobile = window.matchMedia("(max-width: 800px)").matches;
  const label = button.querySelector("span")?.innerText;

  // MOBILE + Library → redirect
  if (isMobile && label === "Library") {
    window.location.href = "library.html";
    return;
  }

  // NORMAL behavior (desktop + other menus)
  if(!button.nextElementSibling.classList.contains('show')){
    closeAllSubMenus();
  }

  button.nextElementSibling.classList.toggle('show');
  button.classList.toggle('rotate');

  if(sidebar.classList.contains('close')){
    sidebar.classList.remove('close');
    toggleButton.classList.remove('rotate');
    localStorage.setItem('sidebarState', 'open');
  }
}


function closeAllSubMenus(){
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}



// ===== CAROUSEL ARROW SCROLLING =====
document.querySelectorAll(".section-header").forEach(section => {
  const carousel = section.nextElementSibling;
  const leftBtn = section.querySelector(".arrow-btn.left");
  const rightBtn = section.querySelector(".arrow-btn.right");

  if (!carousel || !leftBtn || !rightBtn) return;

  const scrollAmount = carousel.offsetWidth * 0.9;

  leftBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });

  rightBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });
});
document.querySelectorAll(".section-header-l2").forEach(section => {
  const carousel = section.nextElementSibling;
  const leftBtn = section.querySelector(".arrow-btn.left");
  const rightBtn = section.querySelector(".arrow-btn.right");

  if (!carousel || !leftBtn || !rightBtn) return;

  const scrollAmount = carousel.offsetWidth * 0.9;

  leftBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });

  rightBtn.addEventListener("click", () => {
    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });
});


/* ============================
   LIBRARY EDIT SYSTEM
============================ */

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("main li[data-id]");
  if (!items.length) return;

  const isEditPage =
    location.pathname.toLowerCase().includes("edit");

  let selected =
    JSON.parse(localStorage.getItem("libraryItems")) || [
      "playlists",
      "artists",
      "albums",
      "songs",
      "podcasts",
      "made-for-you",
      "music-videos",
      "genres",
      "compilations",
      "composers",
      "download"
    ];

  // ===== EDIT PAGE =====
  if (isEditPage) {
    items.forEach(li => {
      const id = li.dataset.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = selected.includes(id);
      checkbox.style.marginRight = "12px";

      li.prepend(checkbox);

      li.addEventListener("click", e => {
        if (e.target.tagName !== "INPUT") {
          checkbox.checked = !checkbox.checked;
        }
      });
    });

    document.getElementById("doneBtn")?.addEventListener("click", e => {
      e.preventDefault();

      selected = [...document.querySelectorAll("input[type=checkbox]")]
        .filter(cb => cb.checked)
        .map(cb => cb.parentElement.dataset.id);

      localStorage.setItem(
        "libraryItems",
        JSON.stringify(selected)
      );

      window.location.href = "library.html";
    });
  }

  // ===== LIBRARY PAGE =====
  if (!isEditPage) {
    items.forEach(li => {
      if (!selected.includes(li.dataset.id)) {
        li.style.display = "none";
      }
    });
  }
});
