const { body } = require('express-validator');

const createBoardValidation = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le nom du board est requis'),
  body('description')
    .optional()
    .trim(),
  body('background')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Couleur de fond invalide (format hex requis)'),
];

const updateBoardValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le nom du board ne peut pas être vide'),
  body('description')
    .optional()
    .trim(),
  body('background')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Couleur de fond invalide (format hex requis)'),
];

const addMemberValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
];

module.exports = {
  createBoardValidation,
  updateBoardValidation,
  addMemberValidation,
};
