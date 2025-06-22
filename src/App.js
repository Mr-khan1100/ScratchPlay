import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import useSprites from "./hooks/useSprites";
import PlayButton from "./components/PlayButton.js";

export default function App() {
  const {
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
  } = useSprites();
  const [positionSelectionMode, setPositionSelectionMode] = useState(false);
  
  const handlePositionSelected = (x, y) => {
    // This would need to update the specific goto block
    // You'll need to implement state to track which block is being edited
    setPositionSelectionMode(false);
  };
  return (
    <div className="bg-blue-100 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar 
            customBlocks={customBlocks}
            addCustomBlock={addCustomBlock}
            updateCustomBlock={updateCustomBlock}
            removeCustomBlock={removeCustomBlock} 
            /> 
            <MidArea scripts={sprites.find(s => s.id === currentSpriteId)?.scripts || []}
            removeBlock={(index) => {
              const currentSprite = sprites.find(s => s.id === currentSpriteId);
              const newScripts = [...currentSprite.scripts];
              newScripts.splice(index, 1);
              updateSprite(currentSpriteId, { scripts: newScripts });
            }}
            setPositionSelectionMode={setPositionSelectionMode}
             addBlock={(block) => {
              const currentSprite = sprites.find(s => s.id === currentSpriteId);
              updateSprite(currentSpriteId, {
                scripts: [...currentSprite.scripts, block]
              });
            }}/>
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea
            sprites={sprites}
            currentSpriteId={currentSpriteId}
            setCurrentSpriteId={setCurrentSpriteId}
            addSprite={addSprite}
            removeSprite={removeSprite}
            updateSprite={updateSprite}
            executeAnimation = {executeAnimation}
            isPlaying = {isPlaying}
            positionSelectionMode={positionSelectionMode}
            onPositionSelected={handlePositionSelected}
          />
        </div>
      </div>
    </div>
  );
}
