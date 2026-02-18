const express = require('express');
const router = express.Router();

const { authController } = require('../controllers');
const { authenticate, validate } = require('../middlewares');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
} = require('../validators');

// Routes publiques
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);

// Routes protégées
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, updateProfileValidation, validate, authController.updateProfile);
router.put('/password', authenticate, changePasswordValidation, validate, authController.changePassword);

module.exports = router;
