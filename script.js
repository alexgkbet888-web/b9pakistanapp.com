(function () {
  const menuButton = document.querySelector(".menu-btn");
  const nav = document.querySelector(".navlinks");
  const search = document.querySelector("[data-search]");
  const searchable = Array.from(document.querySelectorAll("[data-topic]"));
  const gameTabs = Array.from(document.querySelectorAll("[data-game-filter]"));
  const gameCards = Array.from(document.querySelectorAll("[data-game-category]"));

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  if (search) {
    search.addEventListener("input", () => {
      const query = normalize(search.value);
      searchable.forEach((item) => {
        const text = normalize(item.textContent + " " + item.dataset.topic);
        item.classList.toggle("is-hidden", query.length > 0 && !text.includes(query));
      });
    });
  }

  gameTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.gameFilter;
      gameTabs.forEach((item) => item.classList.toggle("active", item === button));
      gameCards.forEach((card) => {
        const show = filter === "all" || card.dataset.gameCategory === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
})();
