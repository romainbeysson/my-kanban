const prisma = require('../config/database');

/**
 * Créer un nouveau board
 */
const createBoard = async (req, res, next) => {
  try {
    const { name, description, background } = req.body;

    const board = await prisma.board.create({
      data: {
        name,
        description,
        background: background || '#0079bf',
        ownerId: req.user.id,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        _count: {
          select: { lists: true, cards: true },
        },
      },
    });

    // Créer une activité
    await prisma.activity.create({
      data: {
        type: 'BOARD_CREATED',
        payload: { boardName: board.name },
        userId: req.user.id,
        boardId: board.id,
      },
    });

    res.status(201).json({ board });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer tous les boards de l'utilisateur
 */
const getBoards = async (req, res, next) => {
  try {
    const boards = await prisma.board.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { members: { some: { id: req.user.id } } },
        ],
        isArchived: false,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        _count: {
          select: { lists: true, cards: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ boards });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un board par ID avec toutes ses données
 */
const getBoardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        lists: {
          where: { isArchived: false },
          orderBy: { position: 'asc' },
          include: {
            cards: {
              where: { isArchived: false },
              orderBy: { position: 'asc' },
              include: {
                assignees: {
                  select: { id: true, name: true, email: true, avatar: true },
                },
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ error: 'Board non trouvé' });
    }

    // Vérifier l'accès
    const isOwner = board.ownerId === req.user.id;
    const isMember = board.members.some((m) => m.id === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json({ board });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un board
 */
const updateBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, background } = req.body;

    const board = await prisma.board.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(background && { background }),
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    res.json({ board });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un board
 */
const deleteBoard = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.board.delete({
      where: { id },
    });

    res.json({ message: 'Board supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

/**
 * Archiver un board
 */
const archiveBoard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const board = await prisma.board.update({
      where: { id },
      data: { isArchived: true },
    });

    res.json({ board, message: 'Board archivé' });
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter un membre au board
 */
const addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const board = await prisma.board.update({
      where: { id },
      data: {
        members: {
          connect: { id: userToAdd.id },
        },
      },
      include: {
        members: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Créer une activité
    await prisma.activity.create({
      data: {
        type: 'MEMBER_ADDED',
        payload: { memberName: userToAdd.name, memberEmail: userToAdd.email },
        userId: req.user.id,
        boardId: board.id,
      },
    });

    res.json({ board });
  } catch (error) {
    next(error);
  }
};

/**
 * Retirer un membre du board
 */
const removeMember = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;

    const board = await prisma.board.update({
      where: { id },
      data: {
        members: {
          disconnect: { id: memberId },
        },
      },
      include: {
        members: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    res.json({ board });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  archiveBoard,
  addMember,
  removeMember,
};
