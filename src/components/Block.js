import React from 'react';

export default function Block({ label, color, data, onDragStart,className = '', onSelectPosition }) {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
  };

   const handleDragStart = (e) => {
    e.dataTransfer.setData('block', JSON.stringify(data));
    if (onDragStart) onDragStart(e, data);
  };

   const handleClick = (e) => {
    if (data?.type === 'goto' && onSelectPosition) {
      e.stopPropagation();
      onSelectPosition(data);
      return;
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
       onClick={handleClick}
      className={`${colorClasses[color] || 'bg-blue-500'} ${className} text-white px-3 py-2 my-1 text-sm cursor-pointer rounded shadow transition`}
    >
      {label}
    </div>
  );
}