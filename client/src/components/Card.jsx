import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChatBubbleLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Card = ({ card, onClick, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'card', card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const labels = card.labels || [];
  const hasDescription = !!card.description;
  const hasDueDate = !!card.dueDate;

  const formatDueDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const isOverdue = () => {
    if (!card.dueDate) return false;
    return new Date(card.dueDate) < new Date();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg p-2 mb-2 shadow-sm hover:shadow-md cursor-pointer transition-shadow border border-gray-200',
        {
          'opacity-50': isSortableDragging,
          'card-dragging': isDragging,
        }
      )}
    >
      {/* Labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {labels.map((label, index) => (
            <span
              key={label.id || index}
              className="px-2 py-0.5 text-xs font-medium text-white rounded"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <p className="text-sm text-gray-800">{card.title}</p>

      {/* Badges */}
      {(hasDescription || hasDueDate || card.assignees?.length > 0) && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {hasDueDate && (
            <span
              className={clsx(
                'flex items-center gap-1 text-xs px-2 py-0.5 rounded',
                isOverdue()
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              <CalendarIcon className="w-3 h-3" />
              {formatDueDate(card.dueDate)}
            </span>
          )}

          {hasDescription && (
            <span className="text-gray-400">
              <ChatBubbleLeftIcon className="w-4 h-4" />
            </span>
          )}

          {/* Assignees */}
          {card.assignees?.length > 0 && (
            <div className="flex -space-x-2 ml-auto">
              {card.assignees.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white"
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {card.assignees.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center border-2 border-white">
                  +{card.assignees.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
