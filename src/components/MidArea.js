import React, { useState } from 'react';
import Block from './Block';

export default function MidArea({ scripts, removeBlock, addBlock, setPositionSelectionMode   }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const blockData = JSON.parse(e.dataTransfer.getData('block'));
    addBlock(blockData);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const [selectedBlock, setSelectedBlock] = useState(null);

  const handleSelectPosition = (block) => {
    setSelectedBlock(block);
    setPositionSelectionMode(true);
  };

  const handlePositionSelected = (x, y) => {
    if (selectedBlock) {
      const updatedBlock = {
        ...selectedBlock,
        x,
        y,
        label: `Go to X: ${x} Y: ${y}`
      };
      

      const index = scripts.findIndex(b => b.id === selectedBlock.id);
      if (index !== -1) {
        const newScripts = [...scripts];
        newScripts[index] = updatedBlock;

      }
      
      setSelectedBlock(null);
    }
  };

  return (
    <div 
      className="flex-1 h-full overflow-auto p-4"
      onDrop={handleDrop}
      onDragOver={allowDrop}
    >
      <div className="min-h-full bg-gray-100 rounded-lg p-4">
        {scripts.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            Drag blocks here to create scripts
          </div>
        ) : (
          scripts.map((script, index) => (
            <div key={index} className="relative group">
              <Block 
                label={getBlockLabel(script)}
                color={script.category === 'motion' ? 'blue' : 'purple'}
                data={script}
                onSelectPosition={handleSelectPosition}
              />
              <button
                onClick={() => removeBlock(index)}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getBlockLabel(block) {
  switch (block.type) {
    case 'move':
      return `Move ${block.value} steps`;
    case 'turn':
      return `Turn ${block.value} degrees`;
    case 'goto':
      return `Go to X: ${block.x || 0} Y: ${block.y || 0}`;
    case 'say':
      return `Say "${block.text}" for ${block.duration} seconds`;
    case 'think':
      return `Think "${block.text}" for ${block.duration} seconds`;
    case 'repeat':
       case 'repeat': return `Repeat ${block.count} times`;
    default:
      return block.label || 'Block';
  }
}