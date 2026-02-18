import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EllipsisHorizontalIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';

import Card from './Card';
import { useCreateCard } from '../hooks/useCards';
import { useUpdateList, useDeleteList } from '../hooks/useLists';

const BoardList = ({ list, boardId, onCardClick }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  
  const inputRef = useRef(null);
  const titleInputRef = useRef(null);

  const createCardMutation = useCreateCard(boardId);
  const updateListMutation = useUpdateList(boardId);
  const deleteListMutation = useDeleteList(boardId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: { type: 'list', list },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (isAddingCard && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingCard]);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing]);

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    createCardMutation.mutate({
      listId: list.id,
      title: newCardTitle.trim(),
    });

    setNewCardTitle('');
    setIsAddingCard(false);
  };

  const handleUpdateTitle = () => {
    if (editTitle.trim() && editTitle !== list.title) {
      updateListMutation.mutate({ id: list.id, title: editTitle.trim() });
    } else {
      setEditTitle(list.title);
    }
    setIsEditing(false);
  };

  const handleDeleteList = () => {
    if (window.confirm(`Supprimer la liste "${list.title}" et toutes ses cartes ?`)) {
      deleteListMutation.mutate(list.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 flex-shrink-0 bg-gray-100 rounded-lg flex flex-col max-h-full"
    >
      {/* List Header */}
      <div
        {...attributes}
        {...listeners}
        className="px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing"
      >
        {isEditing ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdateTitle();
              if (e.key === 'Escape') {
                setEditTitle(list.title);
                setIsEditing(false);
              }
            }}
            className="flex-1 px-2 py-1 font-semibold text-gray-800 bg-white border-2 border-blue-500 rounded outline-none"
          />
        ) : (
          <h3
            onClick={() => setIsEditing(true)}
            className="font-semibold text-gray-800 cursor-pointer hover:bg-gray-200 px-2 py-1 rounded flex-1"
          >
            {list.title}
          </h3>
        )}

        <Menu as="div" className="relative">
          <Menu.Button className="p-1 hover:bg-gray-200 rounded">
            <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleDeleteList}
                  className={`${
                    active ? 'bg-red-50' : ''
                  } w-full text-left px-4 py-2 text-sm text-red-600`}
                >
                  Supprimer la liste
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar">
        <SortableContext
          items={list.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {list.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>

        {/* Add Card Form */}
        {isAddingCard ? (
          <form onSubmit={handleAddCard} className="mt-2">
            <textarea
              ref={inputRef}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Saisissez un titre pour cette carte..."
              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCard(e);
                }
                if (e.key === 'Escape') {
                  setIsAddingCard(false);
                  setNewCardTitle('');
                }
              }}
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                type="submit"
                disabled={!newCardTitle.trim() || createCardMutation.isPending}
                className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle('');
                }}
                className="p-1.5 hover:bg-gray-200 rounded"
              >
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full mt-2 p-2 text-left text-gray-600 hover:bg-gray-200 rounded-lg flex items-center gap-1 transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Ajouter une carte</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardList;
