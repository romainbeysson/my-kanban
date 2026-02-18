import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useBoards, useCreateBoard } from '../hooks';
import CreateBoardModal from '../components/CreateBoardModal';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: boards, isLoading, error } = useBoards();
  const createBoardMutation = useCreateBoard();

  const handleCreateBoard = async (data) => {
    await createBoardMutation.mutateAsync(data);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erreur lors du chargement des boards</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes tableaux</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Create new board card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-32 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
        >
          <div className="text-center">
            <PlusIcon className="w-8 h-8 mx-auto text-gray-600" />
            <span className="text-gray-600 font-medium">Créer un tableau</span>
          </div>
        </button>

        {/* Board cards */}
        {boards?.map((board) => (
          <Link
            key={board.id}
            to={`/boards/${board.id}`}
            className="h-32 rounded-lg p-4 text-white font-semibold hover:opacity-90 transition-opacity relative overflow-hidden"
            style={{ backgroundColor: board.background || '#0079bf' }}
          >
            <span className="relative z-10">{board.name}</span>
            <div className="absolute bottom-2 right-2 text-xs opacity-75">
              {board._count?.lists || 0} listes • {board._count?.cards || 0} cartes
            </div>
          </Link>
        ))}
      </div>

      {boards?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Vous n'avez pas encore de tableau</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Créer votre premier tableau
          </button>
        </div>
      )}

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateBoard}
        isLoading={createBoardMutation.isPending}
      />
    </div>
  );
};

export default Dashboard;
