const express = require('express');
const router = express.Router();
const dbService = require('../database/services');
const fs = require('fs');
const { DB_FOLDER } = require('../config/paths');

router.get('/version', (req, res) => {
  res.json({ version: '1.0.0', status: 'ok' });
});

router.get('/competitions', (req, res) => {
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

router.post('/competitions', (req, res) => {
  try {
    const id = dbService.createCompetition(req.body.name);
    res.status(201).json({ id });
  } catch (e) {
    const code = e.message === "EXIST_ERROR" ? 409 : 500;
    res.status(code).json({ error: e.message });
  }
});

router.post('/:competition/racers/sync', (req, res) => {
  try {
    dbService.syncRacers(req.params.competition, req.body.racers);
    res.json({ message: "OK" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ... Copiez les autres routes ici sur le même modèle
module.exports = router;