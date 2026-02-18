const prisma = require('../config/database');

/**
 * Créer une nouvelle carte
 */
const createCard = async (req, res, next) => {
  try {
    const { listId } = req.params;
    const { title, description, labels, dueDate } = req.body;

    // Récupérer la liste pour avoir le boardId
    const list = await prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      return res.status(404).json({ error: 'Liste non trouvée' });
    }

    // Trouver la position maximale actuelle
    const maxPosition = await prisma.card.aggregate({
      where: { listId },
      _max: { position: true },
    });

    const position = (maxPosition._max.position ?? -1) + 1;

    const card = await prisma.card.create({
      data: {
        title,
        description,
        position,
        labels,
        dueDate: dueDate ? new Date(dueDate) : null,
        listId,
        boardId: list.boardId,
      },
      include: {
        assignees: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Créer une activité
    await prisma.activity.create({
      data: {
        type: 'CARD_CREATED',
        payload: { cardTitle: title, listTitle: list.title },
        userId: req.user.id,
        boardId: list.boardId,
      },
    });

    res.status(201).json({ card });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une carte par ID
 */
const getCardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        list: true,
        assignees: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    if (!card) {
      return res.status(404).json({ error: 'Carte non trouvée' });
    }

    res.json({ card });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une carte
 */
const updateCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, labels, dueDate } = req.body;

    const card = await prisma.card.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(labels !== undefined && { labels }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      include: {
        assignees: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    res.json({ card });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une carte
 */
const deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.card.delete({
      where: { id },
    });

    res.json({ message: 'Carte supprimée' });
  } catch (error) {
    next(error);
  }
};

/**
 * Archiver une carte
 */
const archiveCard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const card = await prisma.card.update({
      where: { id },
      data: { isArchived: true },
    });

    res.json({ card, message: 'Carte archivée' });
  } catch (error) {
    next(error);
  }
};

/**
 * Déplacer une carte (drag & drop)
 */
const moveCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { listId, position } = req.body;

    // Récupérer la carte actuelle
    const currentCard = await prisma.card.findUnique({
      where: { id },
      include: { list: true },
    });

    if (!currentCard) {
      return res.status(404).json({ error: 'Carte non trouvée' });
    }

    const oldListId = currentCard.listId;
    const newListId = listId;

    // Si on change de liste
    if (oldListId !== newListId) {
      // Décrémenter les positions dans l'ancienne liste
      await prisma.card.updateMany({
        where: {
          listId: oldListId,
          position: { gt: currentCard.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      // Incrémenter les positions dans la nouvelle liste
      await prisma.card.updateMany({
        where: {
          listId: newListId,
          position: { gte: position },
        },
        data: {
          position: { increment: 1 },
        },
      });
    } else {
      // Même liste - réordonner
      if (position > currentCard.position) {
        // Déplacer vers le bas
        await prisma.card.updateMany({
          where: {
            listId: oldListId,
            position: {
              gt: currentCard.position,
              lte: position,
            },
          },
          data: {
            position: { decrement: 1 },
          },
        });
      } else if (position < currentCard.position) {
        // Déplacer vers le haut
        await prisma.card.updateMany({
          where: {
            listId: oldListId,
            position: {
              gte: position,
              lt: currentCard.position,
            },
          },
          data: {
            position: { increment: 1 },
          },
        });
      }
    }

    // Mettre à jour la carte
    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        listId: newListId,
        position,
      },
      include: {
        list: true,
        assignees: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Créer une activité si la liste a changé
    if (oldListId !== newListId) {
      const newList = await prisma.list.findUnique({ where: { id: newListId } });
      
      await prisma.activity.create({
        data: {
          type: 'CARD_MOVED',
          payload: {
            cardTitle: updatedCard.title,
            fromList: currentCard.list.title,
            toList: newList.title,
          },
          userId: req.user.id,
          boardId: updatedCard.boardId,
        },
      });
    }

    res.json({ card: updatedCard });
  } catch (error) {
    next(error);
  }
};

/**
 * Réordonner les cartes (bulk update)
 */
const reorderCards = async (req, res, next) => {
  try {
    const { cards } = req.body; // Array de {id, listId, position}

    await prisma.$transaction(
      cards.map(({ id, listId, position }) =>
        prisma.card.update({
          where: { id },
          data: { listId, position },
        })
      )
    );

    res.json({ message: 'Cartes réordonnées' });
  } catch (error) {
    next(error);
  }
};

/**
 * Ajouter un assigné à une carte
 */
const addAssignee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const card = await prisma.card.update({
      where: { id },
      data: {
        assignees: {
          connect: { id: userId },
        },
      },
      include: {
        assignees: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    res.json({ card });
  } catch (error) {
    next(error);
  }
};

/**
 * Retirer un assigné d'une carte
 */
const removeAssignee = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    const card = await prisma.card.update({
      where: { id },
      data: {
        assignees: {
          disconnect: { id: userId },
        },
      },
      include: {
        assignees: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    res.json({ card });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCard,
  getCardById,
  updateCard,
  deleteCard,
  archiveCard,
  moveCard,
  reorderCards,
  addAssignee,
  removeAssignee,
};
