import React, { useState, useEffect } from 'react';

export default function BlockForm({ 
  category, 
  block = null, 
  onSubmit, 
  onCancel 
}) {
  const [type, setType] = useState(block?.type || (category === 'motion' ? 'move' : 'say'));
  const [count, setCount] = useState(block?.count || 2);
  const [label, setLabel] = useState(block?.label || '');
  const [value, setValue] = useState(block?.value || 10);
  const [text, setText] = useState(block?.text || '');
  const [duration, setDuration] = useState(block?.duration || 2);
  const [x, setX] = useState(block?.x || 0); 
  const [y, setY] = useState(block?.y || 0); 
  

  const categoryTypes = {
    motion: ['move', 'turn', 'goto', 'repeat'],
    looks: ['say', 'think']
  };

  const typeLabels = {
    move: 'Move Steps',
    turn: 'Turn Degrees',
    goto: 'Go to Position',
    repeat: 'Repeat',
    say: 'Say',
    think: 'Think'
  };

  useEffect(() => {
    if (!block) {
      setLabel(getDefaultLabel(type));
    }
  }, [type, block, value, text, duration, x, y]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newBlock = {
      type,
      label: label || getDefaultLabel(type),
      ...(type === 'move' || type === 'turn' ? { value } : {}),
      ...(type === 'say' || type === 'think' ? { text, duration } : {}),
       ...(type === 'goto' ? { x, y } : {}),
       ...(type === 'repeat' ? { count } : {})
    };
    
    onSubmit(newBlock);
  };

  const getDefaultLabel = (t) => {
    switch(t) {
      case 'move': return `Move ${value} steps`;
      case 'turn': return `Turn ${value} degrees`;
      case 'goto': return `Go to X: ${x} Y: ${y}`;
      case 'repeat': return `Repeat ${count} times`;
      case 'say': return `Say "${text}" for ${duration} seconds`;
      case 'think': return `Think "${text}" for ${duration} seconds`;
      default: return 'New Block';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-96">
      <h2 className="text-xl font-bold mb-4">
        {block ? 'Edit Block' : 'Create New Block'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!!block}
          >
            {categoryTypes[category].map(t => (
              <option key={t} value={t}>
                {typeLabels[t]}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter block label"
          />
        </div>
        
        {(type === 'move' || type === 'turn') && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {type === 'move' ? 'Steps' : 'Degrees'}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
         {type === 'goto' && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">X Position</label>
                <input
                  type="number"
                  value={x}
                  onChange={(e) => setX(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Y Position</label>
                <input
                  type="number"
                  value={y}
                  onChange={(e) => setY(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        {type === 'repeat' && (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Repeat Count</label>
            <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min="1"
            step="1"
            />
        </div>
        )}
        
        {(type === 'say' || type === 'think') && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter text to display"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min="0.1"
                step="0.1"
              />
            </div>
          </>
        )}
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {block ? 'Update Block' : 'Create Block'}
          </button>
        </div>
      </form>
    </div>
  );
}