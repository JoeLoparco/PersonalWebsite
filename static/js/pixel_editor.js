console.log("Pixel Editor JS loaded");

// Define the BeginnerPixelEditor component using global React
const BeginnerPixelEditor = () => {
  const [gridSize] = React.useState(16);
  const [selectedColor, setSelectedColor] = React.useState('#000000');
  const [pixels, setPixels] = React.useState(Array(16 * 16).fill('#FFFFFF'));
  const [currentTool, setCurrentTool] = React.useState('draw');
  const [showHelp, setShowHelp] = React.useState(true);
  const [sprites, setSprites] = React.useState({});
  const [currentSpriteName, setCurrentSpriteName] = React.useState('');
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [newSpriteName, setNewSpriteName] = React.useState('');

  // Load sprites from localStorage on component mount
  React.useEffect(() => {
    const savedSprites = localStorage.getItem('savedSprites');
    if (savedSprites) {
      setSprites(JSON.parse(savedSprites));
    }
  }, []);

  // Save sprites to localStorage whenever they change
  React.useEffect(() => {
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

  // Convert JSX to React.createElement
  return React.createElement(
    'div',
    { className: "p-6 bg-gray-100 rounded-lg max-w-4xl" },
    
    // Help Dialog
    showHelp && React.createElement(
      'div',
      { className: "mb-6 bg-blue-50 p-4 rounded-lg" },
      React.createElement('h3', { className: "text-lg font-bold mb-2" }, "Quick Start Guide 🎮"),
      React.createElement(
        'ul',
        { className: "list-disc pl-5 space-y-2" },
        React.createElement('li', null, "Start with a template or draw from scratch"),
        React.createElement('li', null, "Save your sprites to work on them later"),
        React.createElement('li', null, "Load previous sprites from your library"),
        React.createElement('li', null, "Use the fill tool to color larger areas")
      ),
      React.createElement(
        'button',
        {
          onClick: () => setShowHelp(false),
          className: "mt-3 text-blue-500 hover:text-blue-700"
        },
        "Got it! Hide this guide"
      )
    ),
    
    // Main Grid Layout
    React.createElement(
      'div',
      { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
      
      // Column 1: Tools
      React.createElement(
        'div',
        null,
        // Templates
        React.createElement(
          'div',
          { className: "mb-6" },
          React.createElement('h3', { className: "text-lg font-bold mb-2" }, "Quick Start Templates"),
          React.createElement(
            'div',
            { className: "flex gap-2" },
            React.createElement(
              'button',
              {
                onClick: () => applyTemplate(templates.character),
                className: "px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              },
              "Character 🧍"
            ),
            React.createElement(
              'button',
              {
                onClick: () => applyTemplate(templates.coin),
                className: "px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              },
              "Coin 🪙"
            ),
            React.createElement(
              'button',
              {
                onClick: () => applyTemplate(templates.heart),
                className: "px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              },
              "Heart ❤️"
            )
          )
        ),
        
        // Tools
        React.createElement(
          'div',
          { className: "mb-6" },
          React.createElement('h3', { className: "text-lg font-bold mb-2" }, "Tools"),
          React.createElement(
            'div',
            { className: "flex gap-2" },
            tools.map(tool => React.createElement(
              'button',
              {
                key: tool.id,
                onClick: () => setCurrentTool(tool.id),
                className: `px-3 py-2 rounded ${
                  currentTool === tool.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`,
                title: tool.name
              },
              tool.icon + " " + tool.name
            ))
          )
        ),
        
        // Colors
        React.createElement(
          'div',
          { className: "mb-6" },
          React.createElement('h3', { className: "text-lg font-bold mb-2" }, "Colors"),
          React.createElement(
            'div',
            { className: "grid grid-cols-2 gap-2" },
            colors.map(color => React.createElement(
              'button',
              {
                key: color.hex,
                className: `p-2 rounded flex items-center gap-2 ${
                  selectedColor === color.hex 
                    ? 'ring-2 ring-blue-500' 
                    : ''
                }`,
                onClick: () => setSelectedColor(color.hex),
                title: color.name
              },
              React.createElement(
                'div',
                {
                  className: "w-6 h-6 rounded",
                  style: { backgroundColor: color.hex }
                }
              ),
              React.createElement('span', { className: "text-sm" }, color.name)
            ))
          )
        )
      ),
      
      // Column 2: Drawing Area
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: "mb-4" },
          React.createElement(
            'h3',
            { className: "text-lg font-bold mb-2" },
            "Drawing Area",
            currentSpriteName && ` - ${currentSpriteName}`
          ),
          React.createElement(
            'div',
            {
              className: "inline-grid bg-gray-200 p-1 rounded",
              style: {
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 24px)`,
                gap: '1px',
                width: 'max-content'
              }
            },
            pixels.map((color, i) => React.createElement(
              'div',
              {
                key: i,
                className: "w-6 h-6 cursor-pointer block",
                style: { backgroundColor: color },
                onClick: () => handlePixelClick(i)
              }
            ))
          )
        ),
        
        // Buttons
        React.createElement(
          'div',
          { className: "flex gap-2" },
          React.createElement(
            'button',
            {
              onClick: () => setShowSaveDialog(true),
              className: "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            },
            "Save Sprite 💾"
          ),
          React.createElement(
            'button',
            {
              onClick: handleExport,
              className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            },
            "Export as PNG 📤"
          )
        )
      ),
      
      // Column 3: Sprite Library
      React.createElement(
        'div',
        null,
        React.createElement('h3', { className: "text-lg font-bold mb-2" }, "Sprite Library"),
        React.createElement(
          'div',
          { className: "bg-white p-4 rounded-lg shadow max-h-96 overflow-y-auto" },
          Object.keys(sprites).length === 0 
            ? React.createElement('p', { className: "text-gray-500" }, "No saved sprites yet")
            : React.createElement(
                'div',
                { className: "space-y-2" },
                Object.entries(sprites).map(([name, spritePixels]) => React.createElement(
                  'div',
                  { key: name, className: "flex items-center justify-between bg-gray-50 p-2 rounded" },
                  React.createElement('span', { className: "font-medium" }, name),
                  React.createElement(
                    'div',
                    { className: "flex gap-2" },
                    React.createElement(
                      'button',
                      {
                        onClick: () => handleLoadSprite(name),
                        className: "text-blue-500 hover:text-blue-700",
                        title: "Load sprite"
                      },
                      "📂"
                    ),
                    React.createElement(
                      'button',
                      {
                        onClick: () => handleDeleteSprite(name),
                        className: "text-red-500 hover:text-red-700",
                        title: "Delete sprite"
                      },
                      "🗑️"
                    )
                  )
                ))
              )
        )
      )
    ),
    
    // Save Dialog
    showSaveDialog && React.createElement(
      'div',
      { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" },
      React.createElement(
        'div',
        { className: "bg-white p-6 rounded-lg" },
        React.createElement('h3', { className: "text-lg font-bold mb-4" }, "Save Sprite"),
        React.createElement(
          'input',
          {
            type: "text",
            value: newSpriteName,
            onChange: (e) => setNewSpriteName(e.target.value),
            placeholder: "Enter sprite name",
            className: "w-full p-2 border rounded mb-4"
          }
        ),
        React.createElement(
          'div',
          { className: "flex justify-end gap-2" },
          React.createElement(
            'button',
            {
              onClick: () => setShowSaveDialog(false),
              className: "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            },
            "Cancel"
          ),
          React.createElement(
            'button',
            {
              onClick: handleSaveSprite,
              className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            },
            "Save"
          )
        )
      )
    )
  );
};

// Make component available globally
window.BeginnerPixelEditor = BeginnerPixelEditor;

// Add initialization code to render when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, attempting to render component");
  const rootElement = document.getElementById('pixel-editor-root');
  
  if (rootElement) {
    console.log("Found root element, rendering component");
    ReactDOM.render(React.createElement(BeginnerPixelEditor), rootElement);
  } else {
    console.error("Could not find element with id 'pixel-editor-root'");
  }
});