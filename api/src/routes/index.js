const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const boardRoutes = require('./boardRoutes');
const listRoutes = require('./listRoutes');
const cardRoutes = require('./cardRoutes');
const activityRoutes = require('./activityRoutes');

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes des boards
router.use('/boards', boardRoutes);

// Routes des listes (imbriquées sous boards)
router.use('/boards/:boardId/lists', listRoutes);

// Routes des cartes (imbriquées sous lists)
router.use('/lists/:listId/cards', cardRoutes);

// Routes des cartes (accès direct)
router.use('/cards', cardRoutes);

// Routes des activités (imbriquées sous boards)
router.use('/boards/:boardId/activities', activityRoutes);

module.exports = router;
