const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- CONFIGURATION SQLITE ---
const DB_FOLDER = path.join(__dirname, '../db');
if (!fs.existsSync(DB_FOLDER)) {
  fs.mkdirSync(DB_FOLDER, { recursive: true });
}

function getDB(competitionName) {
  const safeName = competitionName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  const dbPath = path.join(DB_FOLDER, `${safeName}.db`);
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT,
      score INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
}

// --- ROUTES API v1 ---
app.get('/api/v1/version', (req, res) => {
  res.json({ version: '1.0.0', status: 'ok' });
});

app.get('/api/v1/:competition/results', (req, res) => {
  try {
    const { competition } = req.params;
    const db = getDB(competition);
    const rows = db.prepare('SELECT * FROM results ORDER BY score DESC').all();
    res.json({ competition, data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ACCÈS AU FRONT-END (Fichiers Statiques) ---

// 1. On définit le chemin vers le dossier de build du frontend
const frontendBuildPath = path.join(__dirname, '../../frontend/build');

// 2. On sert les fichiers statiques (JS, CSS, images)
app.use(express.static(frontendBuildPath));

// 3. La route "catch-all" : pour toute requête qui n'est pas une API
// et qui ne correspond pas à un fichier statique, on renvoie l'index.html.
// C'est indispensable pour que le React Router fonctionne.
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  
  // On vérifie si le fichier existe (il ne sera là qu'après le 'npm run build' du front)
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Frontend build not found. Make sure to run 'npm run build' in the frontend folder.");
  }
});

app.listen(port, () => {
  console.log(`Serveur prêt !`);
  console.log(`- API : http://localhost:${port}/api/v1/...`);
  console.log(`- Front : http://localhost:${port}`);
});