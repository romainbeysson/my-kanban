const { body } = require('express-validator');

const createListValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le titre de la liste est requis'),
];

const updateListValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le titre de la liste est requis'),
];

const reorderListsValidation = [
  body('lists')
    .isArray()
    .withMessage('Un tableau de listes est requis'),
  body('lists.*.id')
    .notEmpty()
    .withMessage('L\'ID de la liste est requis'),
  body('lists.*.position')
    .isInt({ min: 0 })
    .withMessage('La position doit être un entier positif'),
];

module.exports = {
  createListValidation,
  updateListValidation,
  reorderListsValidation,
};
