const prisma = require('../config/database');

/**
 * Récupérer les activités d'un board
 */
const getActivities = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const activities = await prisma.activity.findMany({
      where: { boardId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    const total = await prisma.activity.count({
      where: { boardId },
    });

    res.json({
      activities,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivities,
};
