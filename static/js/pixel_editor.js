Copyconsole.log("Pixel Editor JS loaded");
import React, { useState, useEffect } from 'react';

  const BeginnerPixelEditor = () => {
  const [gridSize] = useState(16);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [pixels, setPixels] = useState(Array(16 * 16).fill('#FFFFFF'));
  const [currentTool, setCurrentTool] = useState('draw');
  const [showHelp, setShowHelp] = useState(true);
  const [sprites, setSprites] = useState({});
  const [currentSpriteName, setCurrentSpriteName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSpriteName, setNewSpriteName] = useState('');

  // Load sprites from localStorage on component mount
  useEffect(() => {
    const savedSprites = localStorage.getItem('savedSprites');
    if (savedSprites) {
      setSprites(JSON.parse(savedSprites));
    }
  }, []);

  // Save sprites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedSprites', JSON.stringify(sprites));
  }, [sprites]);

  const colors = [
    { hex: '#000000', name: 'Black (outline)' },
    { hex: '#FFFFFF', name: 'White (background)' },
    { hex: '#FF0000', name: 'Red (enemy)' },
    { hex: '#00FF00', name: 'Green (player)' },
    { hex: '#4444FF', name: 'Blue (special)' },
    { hex: '#FFD700', name: 'Gold (coins)' }
  ];

  const templates = {
    character: [
      0,0,1,1,1,1,0,0,
      0,1,2,2,2,2,1,0,
      1,2,2,2,2,2,2,1,
      0,1,2,2,2,2,1,0,
      0,0,1,1,1,1,0,0,
      0,1,0,1,1,0,1,0,
      1,0,0,1,1,0,0,1,
      0,0,0,1,1,0,0,0
    ],
    coin: [
      0,0,1,1,1,1,0,0,
      0,1,5,5,5,5,1,0,
      1,5,5,5,5,5,5,1,
      1,5,5,5,5,5,5,1,
      1,5,5,5,5,5,5,1,
      1,5,5,5,5,5,5,1,
      0,1,5,5,5,5,1,0,
      0,0,1,1,1,1,0,0
    ],
    heart: [
      0,1,1,0,0,1,1,0,
      1,2,2,1,1,2,2,1,
      1,2,2,2,2,2,2,1,
      0,1,2,2,2,2,1,0,
      0,0,1,2,2,1,0,0,
      0,0,0,1,1,0,0,0
    ]
  };

  const tools = [
    { id: 'draw', name: 'Draw (Paint)', icon: '🖌️' },
    { id: 'fill', name: 'Fill Area', icon: '🪣' },
    { id: 'erase', name: 'Eraser', icon: '🧹' }
  ];

  const applyTemplate = (template) => {
    const newPixels = Array(gridSize * gridSize).fill('#FFFFFF');
    template.forEach((value, i) => {
      if (value === 1) newPixels[i] = '#000000';
      if (value === 2) newPixels[i] = '#FF0000';
      if (value === 5) newPixels[i] = '#FFD700';
    });
    setPixels(newPixels);
    setCurrentSpriteName('');
  };

  const handlePixelClick = (index) => {
    const newPixels = [...pixels];
    if (currentTool === 'erase') {
      newPixels[index] = '#FFFFFF';
    } else if (currentTool === 'fill') {
      const targetColor = pixels[index];
      const fillColor = selectedColor;
      
      const fill = (idx) => {
        if (idx < 0 || idx >= pixels.length) return;
        if (newPixels[idx] !== targetColor) return;
        newPixels[idx] = fillColor;
        
        const x = idx % gridSize;
        if (x > 0) fill(idx - 1);
        if (x < gridSize - 1) fill(idx + 1);
        if (idx >= gridSize) fill(idx - gridSize);
        if (idx < pixels.length - gridSize) fill(idx + gridSize);
      };
      
      fill(index);
    } else {
      newPixels[index] = selectedColor;
    }
    setPixels(newPixels);
  };

  const handleSaveSprite = () => {
    if (newSpriteName.trim()) {
      setSprites(prev => ({
        ...prev,
        [newSpriteName]: pixels
      }));
      setCurrentSpriteName(newSpriteName);
      setNewSpriteName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoadSprite = (name) => {
    setPixels(sprites[name]);
    setCurrentSpriteName(name);
  };

  const handleDeleteSprite = (name) => {
    const newSprites = { ...sprites };
    delete newSprites[name];
    setSprites(newSprites);
    if (currentSpriteName === name) {
      setCurrentSpriteName('');
    }
  };

  const handleExport = () => {
    const canvas = document.createElement('canvas');
    canvas.width = gridSize;
    canvas.height = gridSize;
    const ctx = canvas.getContext('2d');
    
    pixels.forEach((color, i) => {
      const x = i % gridSize;
      const y = Math.floor(i / gridSize);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });

    const dataURL = canvas.toDataURL();
    const link = document.createElement('a');
    link.download = `${currentSpriteName || 'my-game-sprite'}.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg max-w-4xl">
      {showHelp && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Quick Start Guide 🎮</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Start with a template or draw from scratch</li>
            <li>Save your sprites to work on them later</li>
            <li>Load previous sprites from your library</li>
            <li>Use the fill tool to color larger areas</li>
          </ul>
          <button 
            onClick={() => setShowHelp(false)}
            className="mt-3 text-blue-500 hover:text-blue-700"
          >
            Got it! Hide this guide
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Quick Start Templates</h3>
            <div className="flex gap-2">
              <button
                onClick={() => applyTemplate(templates.character)}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Character 🧍
              </button>
              <button
                onClick={() => applyTemplate(templates.coin)}
                className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Coin 🪙
              </button>
              <button
                onClick={() => applyTemplate(templates.heart)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Heart ❤️
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Tools</h3>
            <div className="flex gap-2">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setCurrentTool(tool.id)}
                  className={`px-3 py-2 rounded ${
                    currentTool === tool.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  title={tool.name}
                >
                  {tool.icon} {tool.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Colors</h3>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((color) => (
                <button
                  key={color.hex}
                  className={`p-2 rounded flex items-center gap-2 ${
                    selectedColor === color.hex 
                      ? 'ring-2 ring-blue-500' 
                      : ''
                  }`}
                  onClick={() => setSelectedColor(color.hex)}
                  title={color.name}
                >
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">
              Drawing Area 
              {currentSpriteName && ` - ${currentSpriteName}`}
            </h3>
            <div 
              className="inline-grid bg-gray-200 p-1 rounded"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 24px)`,
                gap: '1px',
                width: 'max-content'
              }}
            >
              {pixels.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 cursor-pointer block"
                  style={{ backgroundColor: color }}
                  onClick={() => handlePixelClick(i)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Sprite 💾
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Export as PNG 📤
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Sprite Library</h3>
          <div className="bg-white p-4 rounded-lg shadow max-h-96 overflow-y-auto">
            {Object.keys(sprites).length === 0 ? (
              <p className="text-gray-500">No saved sprites yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(sprites).map(([name, spritePixels]) => (
                  <div key={name} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="font-medium">{name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadSprite(name)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Load sprite"
                      >
                        📂
                      </button>
                      <button
                        onClick={() => handleDeleteSprite(name)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete sprite"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Save Sprite</h3>
            <input
              type="text"
              value={newSpriteName}
              onChange={(e) => setNewSpriteName(e.target.value)}
              placeholder="Enter sprite name"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSprite}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeginnerPixelEditor;