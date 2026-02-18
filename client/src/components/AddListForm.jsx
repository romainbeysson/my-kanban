import { useState, useRef, useEffect } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCreateList } from '../hooks/useLists';

const AddListForm = ({ boardId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  const createListMutation = useCreateList(boardId);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    createListMutation.mutate({ title: title.trim() });
    setTitle('');
    // Keep the form open for adding more lists
  };

  const handleCancel = () => {
    setIsAdding(false);
    setTitle('');
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-72 flex-shrink-0 bg-white/30 hover:bg-white/40 text-white rounded-lg p-3 flex items-center gap-2 transition h-fit"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Ajouter une liste</span>
      </button>
    );
  }

  return (
    <div className="w-72 flex-shrink-0 bg-gray-100 rounded-lg p-2 h-fit">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Saisissez le titre de la liste..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            type="submit"
            disabled={!title.trim() || createListMutation.isPending}
            className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="p-1.5 hover:bg-gray-200 rounded"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListForm;
