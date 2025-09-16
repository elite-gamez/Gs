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
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const discordBtn = document.getElementById("discordBtn");

discordBtn.onclick = () =>
  window.open("https://discord.gg/FGK4VBJTyd", "_blank");

let gamesData = [];
fetch("games.json")
  .then((res) => res.json())
  .then((games) => {
    gamesData = games;
    games.forEach((game) => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <img src="${game.image}" alt="${game.title}">
        <h2>${game.title}</h2>
        <p>${game.description}</p>
      `;
      card.querySelector("img").addEventListener("click", () => openGame(game));
      gameContainer.appendChild(card);
    });
    updateGameCount();
  });

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
            <style>body,html{margin:0;padding:0;height:100%;overflow:hidden;}</style>
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

  exportBtn.onclick = () => {
    const exportData = {
      cookies: document.cookie,
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
      indexedDB: {},
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${gameTitle.textContent}.data`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  importBtn.onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".data,.json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (importedData.cookies) document.cookie = importedData.cookies;
          if (importedData.localStorage) {
            for (const key in importedData.localStorage) {
              localStorage.setItem(key, importedData.localStorage[key]);
            }
          }
          if (importedData.sessionStorage) {
            for (const key in importedData.sessionStorage) {
              sessionStorage.setItem(key, importedData.sessionStorage[key]);
            }
          }
          alert("Save imported successfully!");
        } catch (err) {
          alert("Failed to import save: " + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };
}

closeModal.onclick = () => {
  gameModal.style.display = "none";
  gameFrame.src = "about:blank";
};

closeChangelog.onclick = () => (changelogModal.style.display = "none");
changelogBtn.onclick = () => (changelogModal.style.display = "flex");

function updateGameCount() {
  gameCountElement.textContent = `Games: ${gameContainer.children.length}`;
}

searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  Array.from(gameContainer.children).forEach((card) => {
    const title = card.querySelector("h2").textContent.toLowerCase();
    card.style.display = title.includes(filter) ? "flex" : "none";
  });
});
