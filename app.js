// ---------------- SIDEBAR ----------------
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

document.addEventListener('DOMContentLoaded', () => {
  const sidebarState = localStorage.getItem('sidebarState');

  if (sidebarState === 'closed') {
    sidebar.classList.add('close');
    toggleButton.classList.add('rotate');
  }
  sidebar.style.visibility = 'visible';
});

function toggleSidebar() {
  const isClosed = sidebar.classList.toggle("close");
  toggleButton.classList.toggle("rotate");


  localStorage.setItem("sidebarState", isClosed ? "closed" : "open");
}


function toggleSubMenu(button) {
  const isMobile = window.matchMedia("(max-width: 800px)").matches;
  const label = button.querySelector("span")?.innerText;

  if (isMobile && label === "Library") {
    window.location.href = "library.html";
    return;
  }

  if (!button.nextElementSibling.classList.contains('show')) {
    closeAllSubMenus();
  }

  button.nextElementSibling.classList.toggle('show');
  button.classList.toggle('rotate');

  if (sidebar.classList.contains('close')) {
    sidebar.classList.remove('close');
    toggleButton.classList.remove('rotate');
    localStorage.setItem('sidebarState', 'open');
  }
}

function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show');
    ul.previousElementSibling.classList.remove('rotate');
  });
}

// ---------------- CAROUSEL ----------------
document.querySelectorAll(".section-header, .section-header-l2").forEach(section => {
  const carousel = section.nextElementSibling;
  const leftBtn = section.querySelector(".arrow-btn.left");
  const rightBtn = section.querySelector(".arrow-btn.right");

  if (!carousel || !leftBtn || !rightBtn) return;

  const scrollAmount = carousel.offsetWidth * 0.9;

  leftBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
});

// ---------------- LIBRARY EDIT SYSTEM (FIXED LAYOUT) ----------------
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("main li[data-id]");
  if (!items.length) return;

  const isEditPage = location.pathname.toLowerCase().includes("edit");

  let selected = JSON.parse(localStorage.getItem("libraryItems")) || [
    "playlists", "artists", "albums", "songs", "podcasts",
    "made-for-you", "music-videos", "genres",
    "compilations", "composers", "download"
  ];

  if (isEditPage) {
    items.forEach(li => {
      const id = li.dataset.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = selected.includes(id);

      // Create wrapper for clean alignment
      const wrapper = document.createElement("div");
      wrapper.className = "library-item";

      // Move existing content into wrapper
      while (li.firstChild) {
        wrapper.appendChild(li.firstChild);
      }

      wrapper.prepend(checkbox);
      li.appendChild(wrapper);

      // Make entire row clickable
      li.addEventListener("click", e => {
        if (e.target.tagName !== "INPUT") {
          checkbox.checked = !checkbox.checked;
        }
      });
    });

    document.getElementById("doneBtn")?.addEventListener("click", e => {
      e.preventDefault();

      selected = [...document.querySelectorAll(".library-item input[type=checkbox]")]
        .filter(cb => cb.checked)
        .map(cb => cb.closest("li").dataset.id);

      localStorage.setItem("libraryItems", JSON.stringify(selected));
      window.location.href = "library.html";
    });
  }

  // Hide unselected items on normal library page
  if (!isEditPage) {
    items.forEach(li => {
      if (!selected.includes(li.dataset.id)) {
        li.style.display = "none";
      }
    });
  }
});

// ---------------- DASHBOARD: ADD TO LIBRARY ----------------
document.addEventListener('DOMContentLoaded', () => {
  const dashboardAddButtons = document.querySelectorAll('.add-btn, .add-btn-more1');

  dashboardAddButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card, .music-card, .more-card');
      if (!card) return;

      const album = {
        title:
          card.dataset.title ||
          card.querySelector('p')?.textContent ||
          card.querySelector('h4')?.textContent,

        artist:
          card.dataset.artist ||
          Array.from(card.querySelectorAll('.Artists a'))
            .map(a => a.textContent)
            .join(', '),

        img: card.dataset.img || card.querySelector('img')?.src
      };

      let library = JSON.parse(localStorage.getItem('myLibrary')) || [];

      if (!library.some(a => a.title === album.title)) {
        library.push(album);
        localStorage.setItem('myLibrary', JSON.stringify(library));
        btn.textContent = '✔';
        btn.disabled = true;
      }
    });
  });
});
document.querySelectorAll(".add-btn,.add-btn-more1, .menu-btn").forEach(btn => {
  btn.addEventListener("click", e => e.stopPropagation());
});

// ---------------- LIBRARY PAGE: RENDER MUSIC GRID ----------------
document.addEventListener('DOMContentLoaded', () => {
  const musicGrid = document.querySelector('.music-grid');
  if (!musicGrid) return;

  musicGrid.innerHTML = '';
  const library = JSON.parse(localStorage.getItem('myLibrary')) || [];

  library.forEach(album => {
    const card = document.createElement('div');
    card.classList.add('music-card');

    card.innerHTML = `
      <img src="${album.img}" alt="${album.title}">
      <h4>${album.title}</h4>
      <div class="artists">
        <a href="#">${album.artist}</a>
      </div>
      <button class="menu-btn">&#8942;</button>
      <div class="menu">
        <button class="remove-btn">Remove from Library</button>
      </div>
    `;

    card.querySelector('.remove-btn').addEventListener('click', () => {
      const updated = library.filter(a => a.title !== album.title);
      localStorage.setItem('myLibrary', JSON.stringify(updated));
      card.remove();
    });

    musicGrid.appendChild(card);
  });
});

// ---------------- MENU TOGGLE ----------------
document.addEventListener("click", e => {
  document.querySelectorAll(".card, .music-card").forEach(card => {
    const btn = card.querySelector(".menu-btn");
    if (btn && btn.contains(e.target)) {
      e.stopPropagation();
      card.classList.toggle("show-menu");
    } else {
      card.classList.remove("show-menu");
    }
  });
});


document.querySelectorAll(".album-card").forEach(card => {
  card.addEventListener("click", e => {

    if (e.target.closest(".add-btn, .menu-btn, .menu")) return;

    const album = {
      img: card.dataset.img,
      title: card.dataset.title,
      artist: card.dataset.artist,
      artistImg: card.dataset.artistImg || "",
      type: card.dataset.type || "Album",
      year: card.dataset.year || ""
    };

    // Safety check (prevents broken album pages)
    if (!album.img || !album.title) {
      console.warn("Incomplete album data", album);
      return;
    }

    localStorage.setItem("currentAlbum", JSON.stringify(album));
    window.location.href = "album.html";
  });
});


document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("album-page")) return;

  const album = JSON.parse(localStorage.getItem("currentAlbum"));

  if (!album) {
    window.location.href = "dashboard.html";
    return;
  }

  const img = document.getElementById("album-img");
  const title = document.getElementById("album-title");
  const type = document.getElementById("album-type");

  // NEW elements (Spotify-style row)
  const artistThumb = document.getElementById("artist-thumb");
  const trackInfo = document.getElementById("track-info");

  if (img) {
    img.crossOrigin = "anonymous"; // IMPORTANT
    img.src = album.img;

    img.onload = () => {
      setGradientFromImage(img);
    };
  }

  if (title) title.textContent = album.title;
  if (type) type.textContent = album.type;

  if (artistThumb && album.artistImg) {
    artistThumb.src = album.artistImg;
  }

  if (trackInfo) {
    trackInfo.innerHTML = `
      <strong>${album.artist}</strong>
      <span>• ${album.title}</span>
      <span>• ${album.year}</span>
      <span>• 3:51</span>
      <span>• 89,228,031</span>
    `;
  }

  document.title = album.title;
});
// ---------------- BACK BUTTON ----------------
function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "dashboard.html";
  }
}

// ---------------- ELEMENTS ----------------
const topBar = document.querySelector(".album-top-bar");
const backBtn = document.querySelector(".mobile-back-btn"); // single button inside top bar

// Scroll fade settings
const fadeStart = 0;   // scrollY where fade starts
const fadeEnd = 120;   // scrollY where top bar becomes fully opaque

// ---------------- SCROLL EVENT ----------------
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Gradually fade in the top bar
  let opacity = 0;
  if (scrollY > fadeStart) {
    opacity = Math.min((scrollY - fadeStart) / (fadeEnd - fadeStart), 1);
  }

  topBar.style.opacity = opacity;
  topBar.style.pointerEvents = opacity > 0 ? "auto" : "none";

  // Optional subtle button movement (optional)
  backBtn.style.transform = `translateY(${Math.min(scrollY / 5, -1)}px)`;
}, { passive: true });

// ---------------- GRADIENT LOGIC ----------------
function setGradientFromImage(imgEl) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = imgEl.naturalWidth;
  canvas.height = imgEl.naturalHeight;

  ctx.drawImage(imgEl, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < imageData.length; i += 40) {
    r += imageData[i];
    g += imageData[i + 1];
    b += imageData[i + 2];
    count++;
  }

  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);

  // Album background
  const header = document.querySelector(".album-header");
  if (header) {
    header.style.background = `
      linear-gradient(
        to bottom,
        rgb(${r}, ${g}, ${b}) 0%,
        rgba(${r}, ${g}, ${b}, 0.6) 40%,
        rgba(${r}, ${g}, ${b}, 0) 100%
      )
    `;
  }

  // Top nav bar gradient
  if (topBar) {
    topBar.style.background = `
      linear-gradient(
        to bottom,
        rgb(${r}, ${g}, ${b}) 100%,
        rgba(${r}, ${g}, ${b}, 0.6) 100%,
        rgba(${r}, ${g}, ${b}, 1) 100%
      )
    `;
  }
}

// ---------------- INITIALIZE ----------------
const albumCover = document.getElementById("album-cover");
if (albumCover.complete) {
  setGradientFromImage(albumCover);
} else {
  albumCover.addEventListener("load", () => setGradientFromImage(albumCover));
}

// Optional: update page title
document.title = albumCover?.alt || "Album";



