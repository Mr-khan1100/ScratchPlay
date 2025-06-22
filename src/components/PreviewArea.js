import React, { useRef } from 'react';
import Sprite from './Sprite';
import PlayButton from './PlayButton';

export default function PreviewArea({ 
  sprites, 
  currentSpriteId, 
  setCurrentSpriteId, 
  addSprite,
  removeSprite,
  updateSprite,
  executeAnimation,
  isPlaying,
  positionSelectionMode,
  onPositionSelected
}) {

   const containerRef = useRef(null);
  
  const handleClick = (e) => {
    if (positionSelectionMode && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onPositionSelected(x, y);
    }
  };
  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col p-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Preview</h2>
        <PlayButton onClick={executeAnimation} disabled={isPlaying} />
        <button
          onClick={addSprite}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
        >
          + Add Sprite
        </button>
      </div>
      
      <div className="flex-1 relative bg-gray-800 rounded-lg overflow-hidden" onClick={handleClick} ref={containerRef}>
        {sprites.map(sprite => (
          <Sprite
            key={sprite.id}
            sprite={sprite}
            isSelected={sprite.id === currentSpriteId}
            onClick={() => setCurrentSpriteId(sprite.id)}
            onPositionChange={(x, y) => updateSprite(sprite.id, { x, y })}
          />
        ))}
        {positionSelectionMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="text-white text-lg font-bold">
              Click anywhere to set position
            </div>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-bold mb-2">Sprites</h3>
        <div className="flex flex-wrap gap-2">
          {sprites.map(sprite => (
            <div
              key={sprite.id}
              className={`flex items-center group px-3 py-1 rounded cursor-pointer ${
                sprite.id === currentSpriteId 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
              }`}
              onClick={() => setCurrentSpriteId(sprite.id)}
            >
              <span className="mr-2">{sprite.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSprite(sprite.id);
                }}
                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}