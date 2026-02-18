import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  CalendarIcon,
  TagIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { useUpdateCard, useDeleteCard } from '../hooks/useCards';

const LABEL_COLORS = [
  { id: 'green', name: 'Vert', color: '#61bd4f' },
  { id: 'yellow', name: 'Jaune', color: '#f2d600' },
  { id: 'orange', name: 'Orange', color: '#ff9f1a' },
  { id: 'red', name: 'Rouge', color: '#eb5a46' },
  { id: 'purple', name: 'Violet', color: '#c377e0' },
  { id: 'blue', name: 'Bleu', color: '#0079bf' },
];

const CardDetailModal = ({ card, boardId, onClose }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(
    card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : ''
  );
  const [labels, setLabels] = useState(card.labels || []);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);

  const updateCardMutation = useUpdateCard(boardId);
  const deleteCardMutation = useDeleteCard(boardId);

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || '');
    setDueDate(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '');
    setLabels(card.labels || []);
  }, [card]);

  const handleSaveTitle = () => {
    if (title.trim() && title !== card.title) {
      updateCardMutation.mutate({ id: card.id, title: title.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (description !== card.description) {
      updateCardMutation.mutate({ id: card.id, description });
    }
    setIsEditingDescription(false);
  };

  const handleDueDateChange = (e) => {
    const newDate = e.target.value;
    setDueDate(newDate);
    updateCardMutation.mutate({
      id: card.id,
      dueDate: newDate || null,
    });
  };

  const handleToggleLabel = (label) => {
    const exists = labels.some((l) => l.id === label.id);
    let newLabels;
    
    if (exists) {
      newLabels = labels.filter((l) => l.id !== label.id);
    } else {
      newLabels = [...labels, label];
    }
    
    setLabels(newLabels);
    updateCardMutation.mutate({ id: card.id, labels: newLabels });
  };

  const handleDelete = () => {
    if (window.confirm('Supprimer cette carte ?')) {
      deleteCardMutation.mutate(card.id);
      onClose();
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-16">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-gray-100 shadow-xl transition-all">
                {/* Header */}
                <div className="bg-white px-6 py-4 border-b relative">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>

                  {/* Labels display */}
                  {labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {labels.map((label) => (
                        <span
                          key={label.id}
                          className="px-2 py-1 text-xs font-medium text-white rounded"
                          style={{ backgroundColor: label.color }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  {isEditingTitle ? (
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={handleSaveTitle}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTitle();
                        if (e.key === 'Escape') {
                          setTitle(card.title);
                          setIsEditingTitle(false);
                        }
                      }}
                      className="text-xl font-semibold text-gray-900 w-full px-2 py-1 border-2 border-blue-500 rounded outline-none"
                      autoFocus
                    />
                  ) : (
                    <Dialog.Title
                      onClick={() => setIsEditingTitle(true)}
                      className="text-xl font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded -mx-2"
                    >
                      {title}
                    </Dialog.Title>
                  )}
                </div>

                <div className="flex gap-4 p-6">
                  {/* Main content */}
                  <div className="flex-1">
                    {/* Description */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <ChatBubbleLeftIcon className="w-5 h-5 text-gray-600" />
                        <h3 className="font-medium text-gray-800">Description</h3>
                      </div>
                      
                      {isEditingDescription ? (
                        <div>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            rows={4}
                            placeholder="Ajoutez une description plus détaillée..."
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleSaveDescription}
                              className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                            >
                              Enregistrer
                            </button>
                            <button
                              onClick={() => {
                                setDescription(card.description || '');
                                setIsEditingDescription(false);
                              }}
                              className="text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => setIsEditingDescription(true)}
                          className="bg-gray-200 hover:bg-gray-300 rounded-lg p-3 cursor-pointer min-h-[80px] text-gray-600"
                        >
                          {description || 'Ajoutez une description plus détaillée...'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="w-48 space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase">
                      Ajouter à la carte
                    </h4>

                    {/* Labels */}
                    <div className="relative">
                      <button
                        onClick={() => setShowLabelPicker(!showLabelPicker)}
                        className="w-full flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm text-gray-700"
                      >
                        <TagIcon className="w-4 h-4" />
                        Étiquettes
                      </button>
                      
                      {showLabelPicker && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg p-2 z-10">
                          {LABEL_COLORS.map((label) => (
                            <button
                              key={label.id}
                              onClick={() => handleToggleLabel(label)}
                              className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100"
                            >
                              <div
                                className="w-8 h-6 rounded"
                                style={{ backgroundColor: label.color }}
                              />
                              <span className="text-sm">{label.name}</span>
                              {labels.some((l) => l.id === label.id) && (
                                <span className="ml-auto text-blue-600">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm text-gray-700 cursor-pointer">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Date d'échéance</span>
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={handleDueDateChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>

                    <hr className="border-gray-300" />

                    <h4 className="text-xs font-semibold text-gray-500 uppercase">
                      Actions
                    </h4>

                    {/* Delete */}
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 bg-red-100 hover:bg-red-200 px-3 py-2 rounded text-sm text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CardDetailModal;
