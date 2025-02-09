import Player from "./Player.js";
import Ennemi from "./Ennemi.js";  // Importer la classe Ennemi

import Obstacle from "./Obstacle.js";
import ObjetSouris from "./ObjetSouris.js";
import Objectif from "./Objectif.js";
import { rectsOverlap } from "./collisions.js";
import { initListeners } from "./ecouteurs.js";

const MAX_LEVEL = 3; // Définir le niveau maximum

export default class Game {
    objetsGraphiques = [];
    gameWon = false;
    niveau = 1; // Variable pour suivre le niveau actuel
    playerMoved = false; 

    constructor(canvas) {
        this.canvas = canvas;
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };

        // Récupérer le niveau maximum atteint depuis le stockage local
        const savedLevel = localStorage.getItem("highestLevel");
        if (savedLevel) {
            this.niveau = parseInt(savedLevel); // Charger le niveau sauvegardé
        }

        // Récupérer le niveau actuel depuis le cookie
        const currentLevel = localStorage.getItem("currentLevel");
        if (currentLevel) {
            this.niveau = parseInt(currentLevel); // Charger le niveau actuel
        }
    }

    async startGame() {
        console.log(`Lancement du niveau ${this.niveau}`);

        localStorage.setItem("currentLevel", this.niveau);

        // Désactiver les boutons de niveau si on est au premier ou dernier niveau
        const highestLevel = parseInt(localStorage.getItem("highestLevel")) || 1;
        const currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
        const prevLevelButton = document.querySelector("#prevLevel");
        const nextLevelButton = document.querySelector("#nextLevel");
        if (highestLevel <= currentLevel || currentLevel === MAX_LEVEL) {
            nextLevelButton.disabled = true;
        } else {
            nextLevelButton.disabled = false;
        }
        if (currentLevel == 1) {
            prevLevelButton.disabled = true;
        }
        else {
            prevLevelButton.disabled = false;
        }

        // Réinitialisation complète pour éviter les doublons
        this.objetsGraphiques = [];
        this.gameWon = false; // Remettre à zéro la victoire
        this.playerMoved = false; // Réinitialiser le mouvement du joueur

        // Effacement du canvas
        this.ctx = this.canvas.getContext("2d");
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Charger le bon niveau
        await this.loadLevel(`niveau/niveau${this.niveau}.json`);

        // Recharger le joueur et l'objet souris
        this.player = new Player(50, 50);
        this.player.vitesseX = 0;
        this.player.vitesseY = 0;
        this.objetsGraphiques.push(this.player);

        this.objetSouris = new ObjetSouris(200, 200, 25, 25, "transparent");
        this.objetsGraphiques.push(this.objetSouris);

        // Réinitialisation des événements d'entrée utilisateur
        if (!this.listenersInitialized) {
            initListeners(this.inputStates, this.canvas);
            this.listenersInitialized = true;
        }

        // Relancer l'animation
        if (!this.animationRunning) {
            this.animationRunning = true;
            this.start();
        }

        this.updateCurrentLevelDisplay(); // Update the level display
    }



    async loadLevel(levelPath) {
        console.log(`Chargement du fichier JSON: ${levelPath}`);
        const response = await fetch(levelPath);
        const levelData = await response.json();

        // Charger l'objectif
        const objectifImage = new Image();
        objectifImage.src = 'assets/images/ananas.png';
        await new Promise(resolve => objectifImage.onload = resolve);

        const objectifData = levelData.objectif;
        this.objectif = new Objectif(objectifData.x, objectifData.y, objectifData.w, objectifData.h, objectifImage, objectifData.w * 2.8, objectifData.h * 2.8);
        this.objetsGraphiques.push(this.objectif);

        // Charger les ennemis avant les obstacles pour qu'ils soient sensibles aux collisions
        if (levelData.ennemis) {
            levelData.ennemis.forEach(ennemiData => {
                let ennemi = new Ennemi(ennemiData.x, ennemiData.y, ennemiData.w, ennemiData.h, ennemiData.direction, ennemiData.speed);
                this.objetsGraphiques.push(ennemi);
            });
        }

        // Charger les obstacles après les ennemis
        const coralImage = new Image();
        coralImage.src = 'assets/images/corail.png';
        await new Promise(resolve => coralImage.onload = resolve);

        levelData.obstacles.forEach(obstacleData => {
            for (let i = 0; i < obstacleData.count; i++) {
                let x = obstacleData.x + (obstacleData.orientation === 'horizontal' ? i * 20 : 0);
                let y = obstacleData.y + (obstacleData.orientation === 'vertical' ? i * 20 : 0);
                let obstacle = new Obstacle(x, y, 20, 20, coralImage);
                this.objetsGraphiques.push(obstacle);
            }
        });
    }


    start() {
        console.log("Game démarré");

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // On démarre une animation à 60 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        // ici on dessine le monstre
        this.drawAllObjects();

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        // l'état des objets du jeu en conséquence
        this.update();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    drawAllObjects() {
        // Dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => {
            obj.draw(this.ctx);
        });
    }

    update() {

        if (!this.player || !this.objetSouris || !this.objectif) return;

        // Déplacement du joueur. 
        if (!this.gameWon) {
            this.movePlayer();
        }

        if (!this.playerMoved) return; // Ne pas mettre à jour les ennemis si le joueur ne bouge pas

        // on met à jouer la position de objetSouris avec la position de la souris
        // Pour un objet qui "suit" la souris mais avec un temps de retard, voir l'exemple
        // du projet "charQuiTire" dans le dossier COURS
        this.objetSouris.x = this.inputStates.mouseX;
        this.objetSouris.y = this.inputStates.mouseY;

        this.checkPlayerSpeed();
        // On regarde si le joueur a atteint la sortie
        this.checkVictory();

        let obstacles = this.objetsGraphiques.filter(obj => obj instanceof Obstacle);

        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Ennemi) {
                obj.update(this.canvas);
                obj.checkCollisionsWithObstacles(obstacles); // Détection des collisions
            }
        });
    }

    async movePlayer() {
        // Attendre que `this.player` soit défini avant de continuer
        while (!this.player) {
            await new Promise(resolve => setTimeout(resolve, 10)); // Attente de 10ms
        }

        this.player.vitesseX = 0;
        this.player.vitesseY = 0;

        if (this.inputStates.ArrowRight) {
            this.player.vitesseX = 3; // Toujours 3, pas d'accumulation
        }
        if (this.inputStates.ArrowLeft) {
            this.player.vitesseX = -3;
        }
        if (this.inputStates.ArrowUp) {
            this.player.vitesseY = -3;
        }
        if (this.inputStates.ArrowDown) {
            this.player.vitesseY = 3;
        }

        if (this.inputStates.ArrowRight || this.inputStates.ArrowLeft || this.inputStates.ArrowUp || this.inputStates.ArrowDown) {
            this.playerMoved = true; // Le joueur a bougé
        }

        this.player.move();
        this.testCollisionsPlayer();
    }


    testCollisionsPlayer() {
        // Teste collision avec les bords du canvas
        this.testCollisionPlayerBordsEcran();

        // Teste collision avec les obstacles
        this.testCollisionPlayerObstacles();

        // Teste collision avec les ennemis
        this.testCollisionPlayerEnnemis();

    }

    testCollisionPlayerBordsEcran() {
        // Raoppel : le x, y du joueur est en son centre, pas dans le coin en haut à gauche!
        if (this.player.x - this.player.w / 2 < 0) {
            // On stoppe le joueur
            this.player.vitesseX = 0;
            // on le remet au point de contaxct
            this.player.x = this.player.w / 2;
        }
        if (this.player.x + this.player.w / 2 > this.canvas.width) {
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.canvas.width - this.player.w / 2;
        }

        if (this.player.y - this.player.h / 2 < 0) {
            this.player.y = this.player.h / 2;
            this.player.vitesseY = 0;

        }

        if (this.player.y + this.player.h / 2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h / 2;
        }
    }

    testCollisionPlayerObstacles() {
        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Obstacle) {
                if (rectsOverlap(
                    this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h,
                    obj.x, obj.y, obj.w, obj.h
                )) {
                    console.log("Collision avec obstacle");

                    let playerLeft = this.player.x - this.player.w / 2;
                    let playerRight = this.player.x + this.player.w / 2;
                    let playerTop = this.player.y - this.player.h / 2;
                    let playerBottom = this.player.y + this.player.h / 2;

                    let objLeft = obj.x;
                    let objRight = obj.x + obj.w;
                    let objTop = obj.y;
                    let objBottom = obj.y + obj.h;

                    let overlapX = Math.min(playerRight, objRight) - Math.max(playerLeft, objLeft);
                    let overlapY = Math.min(playerBottom, objBottom) - Math.max(playerTop, objTop);

                    // Si chevauchement plus important sur X, on bloque le mouvement horizontal
                    if (overlapX < overlapY) {
                        if (this.player.x < obj.x) {
                            this.player.x = objLeft - this.player.w / 2; // Ajuster le joueur à gauche
                        } else {
                            this.player.x = objRight + this.player.w / 2; // Ajuster le joueur à droite
                        }
                        this.player.vitesseX = 0; // Stopper le déplacement horizontal
                    }
                    // Sinon, on bloque le mouvement vertical
                    else {
                        if (this.player.y < obj.y) {
                            this.player.y = objTop - this.player.h / 2; // Ajuster le joueur au-dessus
                        } else {
                            this.player.y = objBottom + this.player.h / 2; // Ajuster le joueur en dessous
                        }
                        this.player.vitesseY = 0; // Stopper le déplacement vertical
                    }
                }
            }
        });
    }


    testCollisionPlayerEnnemis() {
        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Ennemi) {
                if (rectsOverlap(
                    this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h,
                    obj.x, obj.y, obj.w, obj.h
                )) {
                    console.log("Collision avec un ennemi ! Retour au niveau 1...");
                    this.restartToLevel1();
                }
            }
        });
    }

    removeEventListeners() {
        this.canvas.replaceWith(this.canvas.cloneNode(true)); // Clone le canvas pour supprimer les anciens écouteurs
        this.canvas = document.querySelector("canvas"); // Récupérer le nouveau canvas

        this.inputStates = { mouseX: 0, mouseY: 0 }; // Réinitialiser les états d'entrée
        this.listenersInitialized = false; // Marquer les écouteurs comme non initialisés
    }



    restartToLevel1() {
        this.niveau = 1; // Revenir au niveau 1
        localStorage.setItem("currentLevel", this.niveau);
        console.log("Le joueur revient au niveau 1 !");

        this.startGame(); // Relancer le niveau 1
    }

    resetGameComplet() {
        console.log("Réinitialisation complète du jeu sans recharger la page");

        // Supprimer la boucle d’animation en cours
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        // Supprimer tous les objets du jeu
        this.objetsGraphiques = [];
        this.player = null;
        this.objetSouris = null;
        this.objectif = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Supprimer les écouteurs d'événements pour éviter les doublons
        this.removeEventListeners();

        this.gameWon = false; // Réinitialiser l'état de victoire

        // Relancer le jeu avec le niveau actuel
        this.startGame();
    }


    checkVictory() {
        if (this.gameWon) return;

        if (rectsOverlap(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h, this.objectif.x, this.objectif.y, this.objectif.w, this.objectif.h)) {
            this.gameWon = true;
            this.player.vitesseX = 0;
            this.player.vitesseY = 0;
            this.showVictoryPopup();
        }
    }


    checkPlayerSpeed() {
        const maxSpeed = 3; // Vitesse maximale autorisée

        if (Math.abs(this.player.vitesseX) > maxSpeed) {
            console.warn(`VitesseX anormale détectée: ${this.player.vitesseX}, correction en cours...`);
            this.player.vitesseX = Math.sign(this.player.vitesseX) * maxSpeed; // Corrige la vitesse
        }

        if (Math.abs(this.player.vitesseY) > maxSpeed) {
            console.warn(`VitesseY anormale détectée: ${this.player.vitesseY}, correction en cours...`);
            this.player.vitesseY = Math.sign(this.player.vitesseY) * maxSpeed; // Corrige la vitesse
        }
    }



    showVictoryPopup() {
        const popup = document.createElement('div');
        popup.className = 'victory-popup';
        popup.innerHTML = `<p>Félicitations ! Tu as terminé le niveau ${this.niveau}</p>
                           <p>Passage au niveau ${this.niveau + 1} dans <span id="countdown">5</span> secondes...</p>`;
        document.body.appendChild(popup);

        let countdown = 5;
        const countdownElement = document.getElementById('countdown');

        console.log('niveau : ' + this.niveau + ' MAX_LEVEL : ' + MAX_LEVEL);
        if (this.niveau < MAX_LEVEL) {

            const interval = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;

                if (countdown === 0) {
                    clearInterval(interval);
                    popup.remove(); // Supprime le popup



                    // Passer au niveau suivant
                    this.niveau++;

                    // Sauvegarder le niveau maximum atteint
                    localStorage.setItem("highestLevel", this.niveau);
                    localStorage.setItem("currentLevel", this.niveau);

                    setTimeout(() => {
                        this.startGame(); // Relancer le jeu avec le nouveau niveau
                    }, 100);
                }
            }, 1000);
        } else {
            popup.innerHTML = `<p>Félicitations ! Tu as terminé le dernier niveau !</p>
                               <p>Retour au niveau 1 dans <span id="countdown">5</span> secondes...</p>`;

            const interval = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;

                if (countdown === 0) {
                    clearInterval(interval);
                    popup.remove(); // Supprime le popup

                    setTimeout(() => {
                        this.restartToLevel1(); // Retour au niveau 1
                    }, 100);
                }
            }, 1000);
        }
    }


    async loadNextLevel() {
        // Nettoyer la liste des objets graphiques
        this.objetsGraphiques = [];

        // Réinitialiser l'état du jeu
        this.gameWon = false;

        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Recharger le niveau avec les nouvelles configurations
        await this.loadLevel('niveau/niveau2.json');


        // Ajouter à nouveau le joueur et l'objet souris
        this.player = new Player(100, 100);
        this.objetsGraphiques.push(this.player);

        this.objetSouris = new ObjetSouris(200, 200, 25, 25, "transparent");
        this.objetsGraphiques.push(this.objetSouris);

        // Redémarrer la boucle d'animation
        this.start();
    }

    async changeLevel(direction) {
        this.stopAnimation();
        this.niveau += direction;
        if (this.niveau < 1) this.niveau = 1; // Prevent going below level 1
        const highestLevel = parseInt(localStorage.getItem("highestLevel")) || 1;
        if (this.niveau > highestLevel) this.niveau = highestLevel; // Prevenir de dépasser le niveau maximum atteint
        localStorage.setItem("currentLevel", this.niveau); // Enregistrer le niveau actuel

        this.resetGameComplet();
        this.updateCurrentLevelDisplay(); // Update the level display
    }

    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    updateCurrentLevelDisplay() {
        const currentLevelSpan = document.querySelector("#currentLevel");
        currentLevelSpan.textContent = `Niveau actuel : ${this.niveau}`;
    }
}