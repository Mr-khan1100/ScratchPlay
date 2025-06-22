import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Icon({ name, size = 16, className = '' }) {
  const icons = {
    flag: '🚩',
    undo: '↩️',
    redo: '↪️',
    edit: <FaEdit size={size} className={className} />,
    delete: <FaTrash size={size} className={className} />,
  };
  
  return icons[name] || null;
}