const express = require('express');
const cors = require('cors');
const { FRONTEND_BUILD_PATH } = require('./config/paths');
const competitionRoutes = require('./routes/routes');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/v1', competitionRoutes);

// Statique & Catch-all React
app.use(express.static(FRONTEND_BUILD_PATH));
app.get('*', (req, res) => {
  const indexPath = path.join(FRONTEND_BUILD_PATH, 'index.html');
  fs.existsSync(indexPath) ? res.sendFile(indexPath) : res.status(404).send("Build missing");
});

module.exports = app;