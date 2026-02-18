const express = require('express');
const router = express.Router({ mergeParams: true });

const { listController } = require('../controllers');
const { authenticate, validate, checkBoardAccess } = require('../middlewares');
const {
  createListValidation,
  updateListValidation,
  reorderListsValidation,
} = require('../validators');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes liées à un board spécifique (/boards/:boardId/lists)
router.post('/', checkBoardAccess, createListValidation, validate, listController.createList);
router.get('/', checkBoardAccess, listController.getLists);
router.put('/reorder', checkBoardAccess, reorderListsValidation, validate, listController.reorderLists);

// Routes pour une liste spécifique
router.put('/:id', checkBoardAccess, updateListValidation, validate, listController.updateList);
router.delete('/:id', checkBoardAccess, listController.deleteList);
router.post('/:id/archive', checkBoardAccess, listController.archiveList);

module.exports = router;
