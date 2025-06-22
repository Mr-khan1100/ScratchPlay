import React, { useRef, useEffect } from 'react';
import CatSprite from './CatSprite';

export default function Sprite({ sprite, isSelected, onClick, onPositionChange }) {
  const spriteRef = useRef(null);
  
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    
    const startX = e.clientX - sprite.x;
    const startY = e.clientY - sprite.y;
    const startSpriteX = sprite.x;
    const startSpriteY = sprite.y;
    
    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      onPositionChange(startSpriteX + deltaX, startSpriteY + deltaY);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <div
      ref={spriteRef}
      className={`absolute cursor-pointer transform transition-transform ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        left: sprite.x,
        top: sprite.y,
        transform: `rotate(${sprite.rotation}deg)`
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
    >
       <div className="w-20 h-20">  
        <CatSprite />
        <span className="text-xs font-bold text-white">{sprite.name}</span>
      </div>

      {sprite.currentAction && (
        <div className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 ${
          sprite.currentAction.type === 'say' 
            ? 'bg-white border border-gray-300' 
            : 'bg-yellow-100'
        } rounded-lg px-3 py-2 shadow-lg max-w-xs`}>
          <div className="text-sm">
            {sprite.currentAction.type === 'say' ? (
              <span>{sprite.currentAction.text}</span>
            ) : (
              <span className="italic">{sprite.currentAction.text}</span>
            )}
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-inherit rotate-45"></div>
        </div>
      )}
    </div>
  );
}