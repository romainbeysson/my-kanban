const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Nettoyer la base
  await prisma.activity.deleteMany();
  await prisma.card.deleteMany();
  await prisma.list.deleteMany();
  await prisma.board.deleteMany();
  await prisma.user.deleteMany();

  // Créer un utilisateur de test
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('✅ User created:', user.email);

  // Créer un board de démo
  const board = await prisma.board.create({
    data: {
      name: 'Mon Premier Projet',
      description: 'Un tableau de démonstration',
      background: '#0079bf',
      ownerId: user.id,
    },
  });

  console.log('✅ Board created:', board.name);

  // Créer des listes
  const lists = await Promise.all([
    prisma.list.create({
      data: {
        title: 'À faire',
        position: 0,
        boardId: board.id,
      },
    }),
    prisma.list.create({
      data: {
        title: 'En cours',
        position: 1,
        boardId: board.id,
      },
    }),
    prisma.list.create({
      data: {
        title: 'Terminé',
        position: 2,
        boardId: board.id,
      },
    }),
  ]);

  console.log('✅ Lists created:', lists.length);

  // Créer des cartes
  const cards = await Promise.all([
    prisma.card.create({
      data: {
        title: 'Configurer le projet',
        description: 'Installer les dépendances et configurer l\'environnement',
        position: 0,
        boardId: board.id,
        listId: lists[2].id, // Terminé
        labels: [{ id: '1', name: 'Setup', color: '#61bd4f' }],
      },
    }),
    prisma.card.create({
      data: {
        title: 'Créer les composants UI',
        description: 'Développer les composants React avec Tailwind',
        position: 0,
        boardId: board.id,
        listId: lists[1].id, // En cours
        labels: [{ id: '2', name: 'Frontend', color: '#f2d600' }],
      },
    }),
    prisma.card.create({
      data: {
        title: 'Implémenter le drag & drop',
        description: 'Utiliser dnd-kit pour le glisser-déposer',
        position: 1,
        boardId: board.id,
        listId: lists[1].id, // En cours
        labels: [{ id: '2', name: 'Frontend', color: '#f2d600' }],
      },
    }),
    prisma.card.create({
      data: {
        title: 'Ajouter les tests',
        position: 0,
        boardId: board.id,
        listId: lists[0].id, // À faire
        labels: [{ id: '3', name: 'Testing', color: '#ff9f1a' }],
      },
    }),
    prisma.card.create({
      data: {
        title: 'Documentation',
        description: 'Rédiger la documentation du projet',
        position: 1,
        boardId: board.id,
        listId: lists[0].id, // À faire
      },
    }),
  ]);

  console.log('✅ Cards created:', cards.length);

  // Créer quelques activités
  await prisma.activity.create({
    data: {
      type: 'BOARD_CREATED',
      payload: { boardName: board.name },
      userId: user.id,
      boardId: board.id,
    },
  });

  console.log('✅ Activities created');
  console.log('🎉 Seed completed successfully!');
  console.log('\n📧 Demo account:');
  console.log('   Email: demo@example.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
