const { body } = require('express-validator');

const createCardValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le titre de la carte est requis'),
  body('description')
    .optional()
    .trim(),
  body('labels')
    .optional()
    .isArray()
    .withMessage('Les labels doivent être un tableau'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Date d\'échéance invalide'),
];

const updateCardValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le titre ne peut pas être vide'),
  body('description')
    .optional()
    .trim(),
  body('labels')
    .optional()
    .isArray()
    .withMessage('Les labels doivent être un tableau'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Date d\'échéance invalide'),
];

const moveCardValidation = [
  body('listId')
    .notEmpty()
    .withMessage('L\'ID de la liste de destination est requis'),
  body('position')
    .isInt({ min: 0 })
    .withMessage('La position doit être un entier positif'),
];

const reorderCardsValidation = [
  body('cards')
    .isArray()
    .withMessage('Un tableau de cartes est requis'),
  body('cards.*.id')
    .notEmpty()
    .withMessage('L\'ID de la carte est requis'),
  body('cards.*.listId')
    .notEmpty()
    .withMessage('L\'ID de la liste est requis'),
  body('cards.*.position')
    .isInt({ min: 0 })
    .withMessage('La position doit être un entier positif'),
];

const assigneeValidation = [
  body('userId')
    .notEmpty()
    .withMessage('L\'ID de l\'utilisateur est requis'),
];

module.exports = {
  createCardValidation,
  updateCardValidation,
  moveCardValidation,
  reorderCardsValidation,
  assigneeValidation,
};
