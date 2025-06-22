import { useState, useEffect, useRef, useCallback } from 'react';

export default function useSprites() {
  const [sprites, setSprites] = useState([
    { 
      id: 1, 
      name: 'Cat', 
      x: 50, 
      y: 50, 
      rotation: 0,
      currentAction: null,
      scripts: [],
      isDragging: false,
      dragOffset: { x: 0, y: 0 }
    }
  ]);

  const [customBlocks, setCustomBlocks] = useState({
    motion: [
      { id: 1, type: 'move', label: 'Move 10 steps', value: 10, category: 'motion' },
      { id: 2, type: 'turn', label: 'Turn 15 degrees', value: 15, category: 'motion' },
      { id: 3, type: 'goto', label: 'Go to X:10 Y:10', x: 10, y: 10, category: 'motion' },
      { id: 4, type: 'repeat', label: 'Repeat 2 times', count: 2, category: 'motion' }
    ],
    looks: [
      { id: 5, type: 'say', label: 'Say Hello for 2 seconds', text: 'Hello!', duration: 2, category: 'looks' },
      { id: 6, type: 'think', label: 'Think Hmm... for 2 seconds', text: 'Hmm...', duration: 2, category: 'looks' }
    ]
  });

  const nextBlockId = useRef(7);
  const nextSpriteId = useRef(2);
  const [currentSpriteId, setCurrentSpriteId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const collisionPairs = useRef({});
  const actionTimeouts = useRef({});

  const addCustomBlock = (category, block) => {
    const newBlock = { ...block, id: nextBlockId.current++, category };
    setCustomBlocks(prev => ({ ...prev, [category]: [...prev[category], newBlock] }));
  };

  const updateCustomBlock = (id, updates) => {
    setCustomBlocks(prev => {
      const updated = { ...prev };
      ['motion', 'looks'].forEach(cat => {
        updated[cat] = updated[cat].map(b => b.id === id ? { ...b, ...updates } : b);
      });
      return updated;
    });
  };

  const removeCustomBlock = id => {
    setCustomBlocks(prev => {
      const updated = { ...prev };
      ['motion', 'looks'].forEach(cat => {
        updated[cat] = updated[cat].filter(b => b.id !== id);
      });
      return updated;
    });
  };

  const addSprite = useCallback(() => {
    const id = nextSpriteId.current++;
    setSprites(prev => [...prev, {
      id,
      name: `Sprite ${id}`,
      x: Math.random() * 200,
      y: Math.random() * 200,
      rotation: 0,
      currentAction: null,
      scripts: [],
      isDragging: false,
      dragOffset: { x: 0, y: 0 }
    }]);
  }, []);

  const removeSprite = useCallback(id => {
    if (sprites.length <= 1) return;
    setSprites(prev => prev.filter(s => s.id !== id));
    if (id === currentSpriteId) setCurrentSpriteId(prev => sprites.find(s => s.id !== id)?.id || prev);
  }, [sprites, currentSpriteId]);

  const updateSprite = useCallback((id, updates) => {
    setSprites(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const clearAllTimeouts = useCallback(() => {
    Object.values(actionTimeouts.current).forEach(clearTimeout);
    actionTimeouts.current = {};
  }, []);

  // Helper: build flat action sequence with repeat
  const buildSequence = scripts => {
    const idx = scripts.findIndex(s => s.type === 'repeat');
    if (idx === -1) return scripts;
    const before = scripts.slice(0, idx);
    const { count } = scripts[idx];
    const after = scripts.slice(idx + 1);
    return Array.from({ length: count }).flatMap(() => before).concat(after);
  };

  const executeAnimation = useCallback(() => {
    clearAllTimeouts();
    setIsPlaying(true);

    // Schedule sprite actions
    sprites.forEach(sprite => {
      const sequence = buildSequence(sprite.scripts);
      let { x, y, rotation: rot } = sprite;
      let currentAction = null;

      sequence.forEach((script, i) => {
        const delay = i * 500;
        const id = setTimeout(() => {
          // Motion
          if (script.category === 'motion') {
            if (script.type === 'move') {
              x += script.value * Math.cos(rot * Math.PI/180);
              y += script.value * Math.sin(rot * Math.PI/180);
            } else if (script.type === 'turn') rot += script.value;
            else if (script.type === 'goto') {
              x = script.x ?? x;
              y = script.y ?? y;
            }
          }
          // Looks
          if (script.category === 'looks' && ['say','think'].includes(script.type)) {
            currentAction = { type: script.type, text: script.text, duration: script.duration };
            const hid = setTimeout(() => updateSprite(sprite.id, { currentAction: null }), script.duration*1000);
            actionTimeouts.current[`hide-${sprite.id}-${i}`] = hid;
          }
          updateSprite(sprite.id, { x, y, rotation: rot, currentAction });
        }, delay);
        actionTimeouts.current[`${sprite.id}-${i}`] = id;
      });
    });

    // Collision detection
    const currentCollisions = {};
    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        const a = sprites[i];
        const b = sprites[j];
        const key = `${Math.min(a.id,b.id)}-${Math.max(a.id,b.id)}`;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 150) {
          currentCollisions[key] = true;
          if (!collisionPairs.current[key]) {
            updateSprite(a.id, { scripts: [...b.scripts] });
            updateSprite(b.id, { scripts: [...a.scripts] });
          }
        }
      }
    }
    collisionPairs.current = currentCollisions;

    // End playing
    const max = Math.max(...sprites.map(s => buildSequence(s.scripts).length));
    const end = setTimeout(() => setIsPlaying(false), max*2000 + 500);
    actionTimeouts.current['end'] = end;
  }, [sprites, updateSprite, clearAllTimeouts]);

  useEffect(() => () => clearAllTimeouts(), [clearAllTimeouts]);

  return {
    sprites,
    currentSpriteId,
    setCurrentSpriteId,
    addSprite,
    removeSprite,
    updateSprite,
    executeAnimation,
    isPlaying,
    customBlocks,
    addCustomBlock,
    updateCustomBlock,
    removeCustomBlock
  };
}
