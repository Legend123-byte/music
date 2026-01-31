document.addEventListener("DOMContentLoaded", () => {
    const sidePanel = document.getElementById("sidePanel");
    const openBtn = document.getElementById("openBtn");
    const closeBtn = document.getElementById("closeBtn");
    const resizeHandle = document.getElementById("resizeHandle");
    const sideRail = document.getElementById("sideRail");

    if (!sidePanel || !openBtn || !closeBtn || !resizeHandle) return;

    // OPEN / CLOSE
    openBtn.addEventListener("click", () => {
        sidePanel.classList.add('open');
        requestAnimationFrame(() => {
    sidePanel.style.width = "";
  });
    });

    sideRail.addEventListener("click", () => {
  sidePanel.style.width = ""; // reset resize
  sidePanel.classList.add("open");
});



    closeBtn.addEventListener("click", () => {
        sidePanel.classList.remove("open");
    });

    // RESIZE
    let isResizing = false;

    resizeHandle.addEventListener("mousedown", () => {
        isResizing = true;

        sidePanel.classList.add("no-transition");

        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        const newWidth = window.innerWidth - e.clientX;

        if (newWidth >= 240 && newWidth <= 600) {
            sidePanel.style.width = `${newWidth}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        if (!isResizing) return;

        isResizing = false;

        sidePanel.classList.remove("no-transition");

        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    });

});
