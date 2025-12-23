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
  
  if (!fs.existsSync(dbPath)) {
    throw new Error("Compétition introuvable.");
  }
  
  return new Database(dbPath);
}

// --- ROUTES API v1 ---
app.post('/api/v1/competitions', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Le nom de la compétition est requis." });
  }

  const safeName = name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  const dbPath = path.join(DB_FOLDER, `${safeName}.db`);

  if (fs.existsSync(dbPath)) {
    return res.status(409).json({ error: "Cette compétition existe déjà." });
  }

  try {
    const db = new Database(dbPath);

    // --- LECTURE ET EXÉCUTION DU FICHIER SQL ---
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // On exécute tout le contenu du fichier SQL
    db.exec(schema);
    
    res.status(201).json({ 
      message: "Compétition créée avec succès",
      id: safeName 
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'initialisation : " + error.message });
  }
});

app.get('/api/v1/version', (req, res) => {
  res.json({ version: '1.0.0', status: 'ok' });
});

app.get('/api/v1/competitions', (req, res) => {
  try {
    const files = fs.readdirSync(DB_FOLDER);
    const competitions = files
      .filter(file => file.endsWith('.db'))
      .map(file => ({
        id: file.replace('.db', ''),
        name: file.replace('.db', '') // Nom brut
      }));
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/:competition/all
app.get('/api/v1/:competition/all', (req, res) => {
  try {
    const { competition } = req.params;
    const db = getDB(competition);

    // On récupère tout en 3 requêtes simples
    const racers = db.prepare('SELECT data FROM racers').all().map(r => JSON.parse(r.data));
    const info = db.prepare('SELECT config FROM race_info WHERE id = 1').get();
    const rankings = db.prepare('SELECT * FROM rankings').all().map(r => ({
      ...r,
      data: JSON.parse(r.data)
    }));

    res.json({
      racers,
      race: info ? JSON.parse(info.config) : {},
      rankings
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Exemple pour synchroniser les coureurs (RacerManager)
app.post('/api/v1/:competition/racers/sync', (req, res) => {
  const { competition } = req.params;
  const { racers } = req.body; // Array d'objets [{id: 1, name: '...'}, ...]
  const db = getDB(competition);

  try {
    const syncTransaction = db.transaction((data) => {
      // 1. On vide la table existante
      db.prepare('DELETE FROM racers').run();
      
      // 2. On prépare l'insertion
      const insert = db.prepare('INSERT INTO racers (id, data) VALUES (?, ?)');
      
      // 3. On remplit avec les nouvelles données
      for (const racer of data) {
        insert.run(racer.id, JSON.stringify(racer));
      }
    });

    syncTransaction(racers);
    res.json({ message: "Racers synchronized successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

// POST /api/v1/:competition/race-info/sync
app.post('/api/v1/:competition/race-info/sync', (req, res) => {
  const { competition } = req.params;
  const { config } = req.body; // L'objet envoyé par raceManager.toObject()

  if (!config) {
    return res.status(400).json({ error: "Données de configuration manquantes." });
  }

  try {
    const db = getDB(competition);
    
    // On met à jour l'unique ligne de configuration
    const statement = db.prepare(`
      INSERT OR REPLACE INTO race_info (id, config) 
      VALUES (1, ?)
    `);
    
    statement.run(JSON.stringify(config));

    res.json({ message: "Configuration de la course mise à jour." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/:competition/rankings/sync
app.post('/api/v1/:competition/rankings/sync', (req, res) => {
  const { competition } = req.params;
  const { stage_id, type, data } = req.body;

  if (stage_id === undefined || !type || !data) {
    return res.status(400).json({ error: "Données de classement incomplètes." });
  }

  try {
    const db = getDB(competition);
    
    const statement = db.prepare(`
      INSERT OR REPLACE INTO rankings (stage_id, type, data) 
      VALUES (?, ?, ?)
    `);
    
    statement.run(stage_id, type, JSON.stringify(data));

    res.json({ message: `Classement ${type} de l'étape ${stage_id} synchronisé.` });
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