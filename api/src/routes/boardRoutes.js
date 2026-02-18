const express = require('express');
const router = express.Router();

const { boardController } = require('../controllers');
const { authenticate, validate, checkBoardAccess, checkBoardOwnership } = require('../middlewares');
const {
  createBoardValidation,
  updateBoardValidation,
  addMemberValidation,
} = require('../validators');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// CRUD Boards
router.post('/', createBoardValidation, validate, boardController.createBoard);
router.get('/', boardController.getBoards);
router.get('/:id', boardController.getBoardById);
router.put('/:id', checkBoardOwnership, updateBoardValidation, validate, boardController.updateBoard);
router.delete('/:id', checkBoardOwnership, boardController.deleteBoard);
router.post('/:id/archive', checkBoardOwnership, boardController.archiveBoard);

// Gestion des membres (owner only)
router.post('/:id/members', checkBoardOwnership, addMemberValidation, validate, boardController.addMember);
router.delete('/:id/members/:memberId', checkBoardOwnership, boardController.removeMember);

module.exports = router;
