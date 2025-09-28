const gameContainer = document.getElementById("gameContainer");
const gameCountElement = document.getElementById("gameCount");
const searchInput = document.getElementById("searchInput");

const gameModal = document.getElementById("gameModal");
const gameFrame = document.getElementById("gameFrame");
const gameTitle = document.getElementById("gameTitle");
const closeModal = document.getElementById("closeModal");

const changelogModal = document.getElementById("changelogModal");
const changelogBtn = document.getElementById("changelogBtn");
const closeChangelog = document.getElementById("closeChangelog");

const downloadBtn = document.getElementById("downloadBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const aboutBlankBtn = document.getElementById("aboutBlankBtn");
const blobBtn = document.getElementById("blobBtn");
const discordBtn = document.getElementById("discordBtn");

discordBtn.onclick = () =>
  window.open("https://discord.gg/FGK4VBJTyd", "_blank");

let gamesData = [];

fetch("games.json")
  .then((res) => res.json())
  .then((games) => {
    gamesData = games;
    renderGames(gamesData);
  });

function renderGames(games) {
  gameContainer.innerHTML = "";
  games.forEach((game) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.style.display = "flex"; // ✅ always visible by default
    card.innerHTML = `
      <img src="${game.image}" alt="${game.title}">
      <h2>${game.title}</h2>
      <p>${game.description}</p>
    `;
    card.querySelector("img").addEventListener("click", () => openGame(game));
    gameContainer.appendChild(card);
  });
  updateGameCount();
}

function openGame(game) {
  gameFrame.src = "about:blank";
  gameFrame.src = game.url;
  gameTitle.textContent = game.title;
  gameModal.style.display = "flex";

  downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = game.url;
    a.download = `${game.title}.html`;
    a.click();
  };

  fullscreenBtn.onclick = () => {
    if (gameFrame.requestFullscreen) gameFrame.requestFullscreen();
    else if (gameFrame.webkitRequestFullscreen)
      gameFrame.webkitRequestFullscreen();
  };

  aboutBlankBtn.onclick = () => {
    const newTab = window.open("about:blank", "_blank");
    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <title>${game.title}</title>
            <style>
              body,html{margin:0;padding:0;height:100%;overflow:hidden;}
            </style>
          </head>
          <body>
            <iframe src="${game.url}" style="width:100vw;height:100vh;border:none;"></iframe>
          </body>
        </html>
      `);
      newTab.document.close();
    } else {
      alert("Popup blocked! Please allow popups for this site.");
    }
  };

  blobBtn.onclick = () => {
    fetch(game.url)
      .then((res) => res.text())
      .then((html) => {
        const blob = new Blob([html], { type: "text/html" });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      })
      .catch((err) => alert("Failed to open game in blob: " + err));
  };
}

closeModal.onclick = () => {
  gameModal.style.display = "none";
  gameFrame.src = "about:blank";
};

if (closeChangelog) {
  closeChangelog.onclick = () => (changelogModal.style.display = "none");
}
if (changelogBtn) {
  changelogBtn.onclick = () => (changelogModal.style.display = "flex");
}

function updateGameCount() {
  const visibleCards = Array.from(gameContainer.children).filter(
    (card) => card.style.display !== "none"
  );
  gameCountElement.textContent = `Games: ${visibleCards.length}`;
}

searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  let visibleCount = 0;

  Array.from(gameContainer.children).forEach((card) => {
    const title = card.querySelector("h2").textContent.toLowerCase();
    const description = card.querySelector("p").textContent.toLowerCase();
    const matches = title.includes(filter) || description.includes(filter);
    card.style.display = matches ? "flex" : "none";
    if (matches) visibleCount++;
  });

  gameCountElement.textContent = `Games: ${visibleCount}`;
});
