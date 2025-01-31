import Game from "./Game.js";

// Bonne pratique : avoir une fonction appelée une fois
// que la page est prête, que le DOM est chargé, etc.
window.onload = init;

async function init() {
    // On recupère le canvas
    let canvas = document.querySelector("#myCanvas");

    localStorage.setItem("currentLevel", 1);

    // On cree une instance du jeu
    let game = new Game(canvas);
    // ici on utilise await car la méthode init est asynchrone
    // typiquement dans init on charge des images, des sons, etc.
    await game.startGame();

    // Ajout des écouteurs d'événements pour les touches du clavier
    window.addEventListener("keydown", (e) => game.handleKeyDown(e));
    window.addEventListener("keyup", (e) => game.handleKeyUp(e));

    // Ajout des écouteurs d'événements pour les boutons "Niveau précédent" et "Niveau suivant"
    const nextLevelButton = document.querySelector("#nextLevel");
    document.querySelector("#prevLevel").addEventListener("click", () => game.changeLevel(-1));
    nextLevelButton.addEventListener("click", () => game.changeLevel(1));

    // on peut démarrer le jeu
    game.start();
}

