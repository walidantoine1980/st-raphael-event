# 🌴 Agenda Estérel Côte d'Azur

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

Application Web moderne et réactive permettant de recenser, visualiser et exporter un agenda événementiel complet pour l'agglomération de Saint-Raphaël, Fréjus, Agay et Roquebrune-sur-Argens.

## ✨ Fonctionnalités Principales

*   **Dark Mode "Glassmorphism"** : Une interface utilisateur innovante, immersive et premium avec des effets néons.
*   **Export PDF Écologique** : Génération intelligente d'un PDF. À l'écran, le mode sombre est actif. À l'impression, l'application bascule automatiquement sur un fond blanc pur pour économiser l'encre (`@media print`).
*   **Filtres Intelligents (Tourisme)** : Tri dynamique par catégories thématiques et filtre d'isolement des événements gratuits.
*   **Navigation GPS Intégrée** : Bouton dynamique sur chaque carte qui génère une URL et ouvre directement l'itinéraire sur Google Maps.
*   **Automatisation (Scraping)** : Script Python (`scraper/update_events.py`) basé sur Playwright pour extraire automatiquement les futurs agendas des sites institutionnels.

## 🚀 Installation & Lancement

Le projet utilise **Vite** pour des performances optimales.

1. **Installer les dépendances**
```bash
npm install
```

2. **Lancer le serveur de développement**
```bash
npm run dev
```

3. **Générer la version de production**
```bash
npm run build
```

## 🗂️ Structure du Projet

```text
St_Raphael_Event_Github_Package/
├── src/
│   ├── data/
│   │   └── events.json        # Base de données des événements
│   ├── App.jsx                # Composant principal React
│   ├── App.css                # Design system et logique d'impression PDF
│   └── main.jsx               # Point d'entrée de l'application
├── scraper/
│   ├── requirements.txt       # Dépendances Python
│   └── update_events.py       # Script d'extraction automatisée
├── index.html
├── package.json
└── vite.config.js
```

## 🤖 Comment utiliser le Scraper Python

Si vous souhaitez mettre à jour les événements via le script (qui contourne les protections Cloudflare des mairies) :

1. Installer Playwright :
```bash
pip install -r scraper/requirements.txt
playwright install chromium
```
2. Lancer le script :
```bash
python scraper/update_events.py
```
