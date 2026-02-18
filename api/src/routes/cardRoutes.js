const express = require('express');
const router = express.Router({ mergeParams: true });

const { cardController } = require('../controllers');
const { authenticate, validate } = require('../middlewares');
const {
  createCardValidation,
  updateCardValidation,
  moveCardValidation,
  reorderCardsValidation,
  assigneeValidation,
} = require('../validators');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Créer une carte dans une liste
router.post('/', createCardValidation, validate, cardController.createCard);

// Routes pour une carte spécifique (sans listId)
router.get('/:id', cardController.getCardById);
router.put('/:id', updateCardValidation, validate, cardController.updateCard);
router.delete('/:id', cardController.deleteCard);
router.post('/:id/archive', cardController.archiveCard);

// Déplacer/réordonner
router.put('/:id/move', moveCardValidation, validate, cardController.moveCard);
router.put('/reorder', reorderCardsValidation, validate, cardController.reorderCards);

// Assignés
router.post('/:id/assignees', assigneeValidation, validate, cardController.addAssignee);
router.delete('/:id/assignees/:userId', cardController.removeAssignee);

module.exports = router;
