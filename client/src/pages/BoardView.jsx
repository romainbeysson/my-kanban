import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

import { useBoard } from '../hooks/useBoards';
import { useMoveCard } from '../hooks/useCards';
import { useReorderLists } from '../hooks/useLists';

import BoardList from '../components/BoardList';
import AddListForm from '../components/AddListForm';
import Card from '../components/Card';
import CardDetailModal from '../components/CardDetailModal';
import LoadingSpinner from '../components/LoadingSpinner';

const BoardView = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: board, isLoading, error } = useBoard(boardId);
  const moveCardMutation = useMoveCard(boardId);
  const reorderListsMutation = useReorderLists(boardId);

  const [activeCard, setActiveCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const findListByCardId = useCallback((cardId) => {
    if (!board?.lists) return null;
    for (const list of board.lists) {
      if (list.cards.some((card) => card.id === cardId)) {
        return list;
      }
    }
    return null;
  }, [board?.lists]);

  const findCardById = useCallback((cardId) => {
    if (!board?.lists) return null;
    for (const list of board.lists) {
      const card = list.cards.find((c) => c.id === cardId);
      if (card) return card;
    }
    return null;
  }, [board?.lists]);

  const handleDragStart = (event) => {
    const { active } = event;
    const card = findCardById(active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if we're dragging a list
    const isActiveAList = board.lists.some((list) => list.id === activeId);
    const isOverAList = board.lists.some((list) => list.id === overId);

    if (isActiveAList && isOverAList) {
      // Reorder lists
      const oldIndex = board.lists.findIndex((list) => list.id === activeId);
      const newIndex = board.lists.findIndex((list) => list.id === overId);
      
      if (oldIndex !== newIndex) {
        const newLists = arrayMove(board.lists, oldIndex, newIndex);
        const reorderedLists = newLists.map((list, index) => ({
          id: list.id,
          position: index,
        }));
        
        // Optimistic update
        queryClient.setQueryData(['board', boardId], (old) => ({
          ...old,
          lists: newLists.map((list, index) => ({ ...list, position: index })),
        }));
        
        reorderListsMutation.mutate(reorderedLists);
      }
      return;
    }

    // Handle card movement
    const activeList = findListByCardId(activeId);
    let overList = findListByCardId(overId);
    
    // If over is a list (dropping on empty list or list header)
    if (!overList && isOverAList) {
      overList = board.lists.find((list) => list.id === overId);
    }

    if (!activeList || !overList) return;

    const activeCard = activeList.cards.find((card) => card.id === activeId);
    if (!activeCard) return;

    // Calculate new position
    let newPosition = 0;
    if (overId === overList.id) {
      // Dropped on empty list
      newPosition = 0;
    } else {
      const overCardIndex = overList.cards.findIndex((card) => card.id === overId);
      newPosition = overCardIndex >= 0 ? overCardIndex : overList.cards.length;
    }

    // Only update if something changed
    if (activeList.id !== overList.id || activeCard.position !== newPosition) {
      // Optimistic update
      queryClient.setQueryData(['board', boardId], (old) => {
        const newLists = old.lists.map((list) => {
          if (list.id === activeList.id && list.id === overList.id) {
            // Same list reorder
            const cards = [...list.cards];
            const oldIndex = cards.findIndex((c) => c.id === activeId);
            const newCards = arrayMove(cards, oldIndex, newPosition);
            return {
              ...list,
              cards: newCards.map((c, i) => ({ ...c, position: i })),
            };
          } else if (list.id === activeList.id) {
            // Remove from source
            return {
              ...list,
              cards: list.cards
                .filter((c) => c.id !== activeId)
                .map((c, i) => ({ ...c, position: i })),
            };
          } else if (list.id === overList.id) {
            // Add to destination
            const newCards = [...list.cards];
            newCards.splice(newPosition, 0, { ...activeCard, listId: overList.id });
            return {
              ...list,
              cards: newCards.map((c, i) => ({ ...c, position: i })),
            };
          }
          return list;
        });
        return { ...old, lists: newLists };
      });

      moveCardMutation.mutate({
        id: activeId,
        listId: overList.id,
        position: newPosition,
      });
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeList = findListByCardId(activeId);
    let overList = findListByCardId(overId);
    
    // If over is a list
    if (!overList && board.lists.some((list) => list.id === overId)) {
      overList = board.lists.find((list) => list.id === overId);
    }

    if (!activeList || !overList || activeList.id === overList.id) return;

    // Optimistic preview for moving between lists
    queryClient.setQueryData(['board', boardId], (old) => {
      const activeCard = activeList.cards.find((c) => c.id === activeId);
      if (!activeCard) return old;

      const overCardIndex = overList.cards.findIndex((c) => c.id === overId);
      const newPosition = overCardIndex >= 0 ? overCardIndex : overList.cards.length;

      const newLists = old.lists.map((list) => {
        if (list.id === activeList.id) {
          return {
            ...list,
            cards: list.cards.filter((c) => c.id !== activeId),
          };
        } else if (list.id === overList.id) {
          const newCards = [...list.cards.filter((c) => c.id !== activeId)];
          newCards.splice(newPosition, 0, { ...activeCard, listId: overList.id });
          return {
            ...list,
            cards: newCards,
          };
        }
        return list;
      });

      return { ...old, lists: newLists };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erreur lors du chargement du board</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-[calc(100vh-64px)] flex flex-col"
      style={{ backgroundColor: board.background || '#0079bf' }}
    >
      {/* Board Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/80 hover:text-white transition"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">{board.name}</h1>
        </div>
        <button className="text-white/80 hover:text-white transition">
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full">
            <SortableContext
              items={board.lists.map((list) => list.id)}
              strategy={horizontalListSortingStrategy}
            >
              {board.lists.map((list) => (
                <BoardList
                  key={list.id}
                  list={list}
                  boardId={boardId}
                  onCardClick={setSelectedCard}
                />
              ))}
            </SortableContext>

            <AddListForm boardId={boardId} />
          </div>

          <DragOverlay>
            {activeCard && (
              <Card card={activeCard} isDragging />
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          boardId={boardId}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

export default BoardView;
