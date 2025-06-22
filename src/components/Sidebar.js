import React, { useState } from 'react';
import Block from './Block';
import Icon from './Icon';
import BlockForm from './BlockForm';

export default function Sidebar({ 
  customBlocks, 
  addCustomBlock, 
  updateCustomBlock, 
  removeCustomBlock 
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('motion');
  
  const handleAddBlock = (category) => {
    setCurrentCategory(category);
    setEditingBlock(null);
    setShowForm(true);
  };
  
  const handleEditBlock = (block) => {
    setCurrentCategory(block.category);
    setEditingBlock(block);
    setShowForm(true);
  };
  
  const handleSubmitBlock = (newBlock) => {
    if (editingBlock) {
      updateCustomBlock(editingBlock.id, newBlock);
    } else {
      addCustomBlock(currentCategory, newBlock);
    }
    setShowForm(false);
  };

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      {showForm ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <BlockForm
            category={currentCategory}
            block={editingBlock}
            onSubmit={handleSubmitBlock}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : null}
      
      <div className="font-bold mb-2">Events</div>
      <Block 
        label="When clicked" 
        color="yellow" 
        data={{ type: 'event', category: 'event' }}
        onDragStart={(e, data) => e.dataTransfer.setData('block', JSON.stringify(data))}
      />
      
      <div className="w-full flex justify-between items-center mt-4">
        <div className="font-bold">Motion</div>
        <button
          onClick={() => handleAddBlock('motion')}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
        >
          + Add
        </button>
      </div>
      
      {customBlocks.motion.map((block) => (
        <div key={block.id} className="flex items-center group w-full">
          <Block 
            label={block.label}
            color="blue"
            data={block}
            onDragStart={(e, data) => e.dataTransfer.setData('block', JSON.stringify(data))}
            className="flex-1"
          />
          <div className="ml-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleEditBlock(block)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Icon name="edit" size={14} />
            </button>
            <button
              onClick={() => removeCustomBlock(block.id)}
              className="text-red-500 hover:text-red-700 ml-1"
            >
              <Icon name="delete" size={14} />
            </button>
          </div>
        </div>
      ))}
      
      <div className="w-full flex justify-between items-center mt-4">
        <div className="font-bold">Looks</div>
        <button
          onClick={() => handleAddBlock('looks')}
          className="text-xs bg-purple-500 text-white px-2 py-1 rounded"
        >
          + Add
        </button>
      </div>
      
      {customBlocks.looks.map((block) => (
        <div key={block.id} className="flex items-center group w-full">
          <Block 
            label={block.label}
            color="purple"
            data={block}
            onDragStart={(e, data) => e.dataTransfer.setData('block', JSON.stringify(data))}
            className="flex-1"
          />
          <div className="ml-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleEditBlock(block)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Icon name="edit" size={14} />
            </button>
            <button
              onClick={() => removeCustomBlock(block.id)}
              className="text-red-500 hover:text-red-700 ml-1"
            >
              <Icon name="delete" size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}