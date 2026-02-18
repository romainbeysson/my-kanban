require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globaux
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes API
app.use('/api', routes);

// Page d'accueil avec documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Mon Trello API',
    version: '1.0.0',
    status: 'running',
    documentation: {
      auth: {
        'POST /api/auth/register': 'Inscription',
        'POST /api/auth/login': 'Connexion',
        'GET /api/auth/profile': 'Profil utilisateur (auth requise)',
      },
      boards: {
        'GET /api/boards': 'Liste des boards',
        'POST /api/boards': 'Créer un board',
        'GET /api/boards/:id': 'Détail d\'un board',
        'PUT /api/boards/:id': 'Modifier un board',
        'DELETE /api/boards/:id': 'Supprimer un board',
      },
      lists: {
        'GET /api/boards/:boardId/lists': 'Listes d\'un board',
        'POST /api/boards/:boardId/lists': 'Créer une liste',
        'PUT /api/boards/:boardId/lists/:id': 'Modifier une liste',
        'DELETE /api/boards/:boardId/lists/:id': 'Supprimer une liste',
      },
      cards: {
        'POST /api/lists/:listId/cards': 'Créer une carte',
        'GET /api/cards/:id': 'Détail d\'une carte',
        'PUT /api/cards/:id': 'Modifier une carte',
        'DELETE /api/cards/:id': 'Supprimer une carte',
        'PUT /api/cards/:id/move': 'Déplacer une carte',
      },
    },
    health: '/health',
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
});
