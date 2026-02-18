const express = require('express');
const router = express.Router({ mergeParams: true });

const { activityController } = require('../controllers');
const { authenticate, checkBoardAccess } = require('../middlewares');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Récupérer les activités d'un board
router.get('/', checkBoardAccess, activityController.getActivities);

module.exports = router;
