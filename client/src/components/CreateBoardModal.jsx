import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const BOARD_COLORS = [
  '#0079bf', // Blue
  '#d29034', // Orange
  '#519839', // Green
  '#b04632', // Red
  '#89609e', // Purple
  '#cd5a91', // Pink
  '#4bbf6b', // Light green
  '#00aecc', // Cyan
  '#838c91', // Gray
];

const CreateBoardModal = ({ isOpen, onClose, onCreate, isLoading }) => {
  const [name, setName] = useState('');
  const [background, setBackground] = useState(BOARD_COLORS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onCreate({ name: name.trim(), background });
    setName('');
    setBackground(BOARD_COLORS[0]);
  };

  const handleClose = () => {
    setName('');
    setBackground(BOARD_COLORS[0]);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Créer un tableau
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  {/* Preview */}
                  <div
                    className="h-24 rounded-lg mb-4 flex items-center justify-center"
                    style={{ backgroundColor: background }}
                  >
                    <span className="text-white font-semibold text-lg">
                      {name || 'Nom du tableau'}
                    </span>
                  </div>

                  {/* Name input */}
                  <div className="mb-4">
                    <label
                      htmlFor="boardName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nom du tableau
                    </label>
                    <input
                      type="text"
                      id="boardName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Ex: Mon projet"
                      autoFocus
                    />
                  </div>

                  {/* Color picker */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur de fond
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {BOARD_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setBackground(color)}
                          className={`w-10 h-8 rounded transition-transform hover:scale-110 ${
                            background === color
                              ? 'ring-2 ring-offset-2 ring-blue-500'
                              : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={!name.trim() || isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Création...' : 'Créer'}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateBoardModal;
