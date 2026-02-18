const prisma = require('../config/database');

/**
 * Middleware pour vérifier l'accès à un board
 * L'utilisateur doit être owner ou member
 */
const checkBoardAccess = async (req, res, next) => {
  try {
    const boardId = req.params.boardId || req.body.boardId;
    
    if (!boardId) {
      return res.status(400).json({ error: 'Board ID requis' });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        members: { select: { id: true } },
      },
    });

    if (!board) {
      return res.status(404).json({ error: 'Board non trouvé' });
    }

    const isOwner = board.ownerId === req.user.id;
    const isMember = board.members.some((m) => m.id === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'Accès non autorisé à ce board' });
    }

    req.board = board;
    req.isOwner = isOwner;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware pour vérifier que l'utilisateur est owner du board
 */
const checkBoardOwnership = async (req, res, next) => {
  try {
    const boardId = req.params.boardId || req.params.id;
    
    if (!boardId) {
      return res.status(400).json({ error: 'Board ID requis' });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({ error: 'Board non trouvé' });
    }

    if (board.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Seul le propriétaire peut effectuer cette action' });
    }

    req.board = board;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkBoardAccess, checkBoardOwnership };
