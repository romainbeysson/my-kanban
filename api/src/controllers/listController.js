const prisma = require('../config/database');

/**
 * Créer une nouvelle liste
 */
const createList = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    // Trouver la position maximale actuelle
    const maxPosition = await prisma.list.aggregate({
      where: { boardId },
      _max: { position: true },
    });

    const position = (maxPosition._max.position ?? -1) + 1;

    const list = await prisma.list.create({
      data: {
        title,
        position,
        boardId,
      },
      include: {
        cards: true,
      },
    });

    // Créer une activité
    await prisma.activity.create({
      data: {
        type: 'LIST_CREATED',
        payload: { listTitle: title },
        userId: req.user.id,
        boardId,
      },
    });

    res.status(201).json({ list });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer toutes les listes d'un board
 */
const getLists = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const lists = await prisma.list.findMany({
      where: {
        boardId,
        isArchived: false,
      },
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
    });

    res.json({ lists });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une liste
 */
const updateList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const list = await prisma.list.update({
      where: { id },
      data: { title },
      include: {
        cards: {
          where: { isArchived: false },
          orderBy: { position: 'asc' },
        },
      },
    });

    res.json({ list });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une liste
 */
const deleteList = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.list.delete({
      where: { id },
    });

    res.json({ message: 'Liste supprimée' });
  } catch (error) {
    next(error);
  }
};

/**
 * Archiver une liste
 */
const archiveList = async (req, res, next) => {
  try {
    const { id } = req.params;

    const list = await prisma.list.update({
      where: { id },
      data: { isArchived: true },
    });

    res.json({ list, message: 'Liste archivée' });
  } catch (error) {
    next(error);
  }
};

/**
 * Réordonner les listes
 */
const reorderLists = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { lists } = req.body; // Array de {id, position}

    // Mettre à jour chaque liste avec sa nouvelle position
    await prisma.$transaction(
      lists.map(({ id, position }) =>
        prisma.list.update({
          where: { id },
          data: { position },
        })
      )
    );

    // Récupérer les listes mises à jour
    const updatedLists = await prisma.list.findMany({
      where: { boardId, isArchived: false },
      orderBy: { position: 'asc' },
      include: {
        cards: {
          where: { isArchived: false },
          orderBy: { position: 'asc' },
        },
      },
    });

    res.json({ lists: updatedLists });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createList,
  getLists,
  updateList,
  deleteList,
  archiveList,
  reorderLists,
};
