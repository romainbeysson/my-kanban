module.exports = {
  authenticate: require('./auth').authenticate,
  optionalAuth: require('./auth').optionalAuth,
  validate: require('./validate'),
  errorHandler: require('./errorHandler'),
  checkBoardAccess: require('./boardAccess').checkBoardAccess,
  checkBoardOwnership: require('./boardAccess').checkBoardOwnership,
};
