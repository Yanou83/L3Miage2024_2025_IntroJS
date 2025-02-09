## ✨ Plankton Escape - Jeu en JavaScript

### 📀 Description
Plankton Escape est un jeu en **JavaScript** où le joueur doit atteindre un objectif tout en évitant les ennemis (Plankton) qui se déplacent automatiquement sur l’axe **X** ou **Y** et rebondissent sur les obstacles.

Le jeu inclut :
- 📝 **Gestion des niveaux dynamiques** (chargés depuis un fichier JSON).
- 🔥 **Ennemis intelligents** qui rebondissent sur les bords et obstacles.
- 🎮 **Système de victoire** : le joueur doit atteindre un objectif.
- 🧐 **Détection avancée des collisions** pour les murs et ennemis.
- 📚 **Persistance des niveaux débloqués** via `localStorage`.

---

### 🚀 Installation
1. **Clone** le projet :
   ```bash
   git clone https://github.com/Yanou83/TPWebJS_L3Miage.git
   ```
2. **Ouvre le dossier** :
   ```bash
   cd COURS/ProjetCanvas1
   ```
3. **Lance le jeu** en ouvrant `index.html` dans ton navigateur.

---

### 🎮 Comment Jouer
- **Déplace ton personnage** avec les flèches du clavier (`←`, `→`, `↑`, `↓`).
- **Évite les ennemis (Plankton)** qui se déplacent seuls et rebondissent sur les obstacles.
- **Atteins l'objectif (maison)** (l’ananas) pour passer au niveau suivant.
- **Navigue entre les niveaux** avec les boutons `Niveau suivant` et `Niveau précédent` selon si tu les as débloqué.

---

### 🛠️ Technologies Utilisées
- **HTML5 / CSS3** pour l'affichage.
- **JavaScript (ES6)** pour la logique du jeu.
- **Canvas API** pour le rendu graphique.
- **localStorage** pour sauvegarder la progression.
- **JSON** pour stocker les niveaux.

---

### 📂 Structure du Projet
```
📦 ProjetCanvas1
├── 📎 assets
│   ├── 📎 images
│   │   ├── plankton.png
│   │   ├── corail.png
│   │   ├── ananas.png
│   │   ├── fond_bobleponge.png
├── 📎 niveau
│   ├── niveau1.json
│   ├── niveau2.json
│   ├── niveau3.json
├── 📎 src
│   ├── Game.js
│   ├── Player.js
│   ├── Ennemi.js
│   ├── ObjectGraphique.js
│   ├── Obstacle.js
│   ├── Objectif.js
│   ├── collisions.js
│   ├── ecouteurs.js
│   ├── utils.js
├── index.html
├── styles.css
├── README.md
```

---

### 🌟 Améliorations Possibles
✅ **Animations plus fluides** (ajouter des effets sur les déplacements).  
✅ **Ajout d’un système de score**.  
✅ **Nouvelle IA pour Plankton** (changer de direction en poursuivant le joueur).  
✅ **Effets sonores** lors des collisions et victoires.  

---

### 📜 Licence
Ce projet est sous licence **MIT** – Tu peux l'utiliser et le modifier librement.

---

Si ce projet t'intéresse, **n'hésite pas à donner une ⭐ sur GitHub** et à contribuer !
