import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;
const DATA_PATH = path.resolve('../anniversaires-app/src/data/birthdays.json');

app.use(cors());
app.use(express.json());

// GET: Liste des anniversaires
app.get('/api/birthdays', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture fichier.' });
    res.json(JSON.parse(data));
  });
});

// POST: Ajouter un anniversaire
app.post('/api/birthdays', (req, res) => {
  const { name, date } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'Nom et date requis.' });
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture fichier.' });
    let birthdays = JSON.parse(data);
    birthdays.push({ name, date });
    fs.writeFile(DATA_PATH, JSON.stringify(birthdays, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Erreur écriture fichier.' });
      res.json({ success: true });
    });
  });
});

// DELETE: Supprimer un anniversaire par index
app.delete('/api/birthdays/:index', (req, res) => {
  const idx = parseInt(req.params.index);
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture fichier.' });
    let birthdays = JSON.parse(data);
    if (idx < 0 || idx >= birthdays.length) return res.status(400).json({ error: 'Index invalide.' });
    birthdays.splice(idx, 1);
    fs.writeFile(DATA_PATH, JSON.stringify(birthdays, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Erreur écriture fichier.' });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur maintenance anniversaires lancé sur http://localhost:${PORT}`);
});
