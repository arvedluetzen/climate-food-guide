// Actions bipartite diagram with hover-triggered arrows
window.actionsDiagram = null;
window.diagramReloadHandlers = window.diagramReloadHandlers || [];

// helper for theme colors
function tc(name, fallback) {
  return (window.themeColors && window.themeColors[name]) || fallback;
}

// Define actions (left column) and areas (right column)
const actionsData = {
  actions: [
    { id: 'work', label: 'Work', emoji: '💼', source: '4-work' },
    { id: 'volunteer', label: 'Volunteer', emoji: '🤝', source: '4-volunteer' },
    { id: 'buy', label: 'Buy', emoji: '🛒', source: '4-buy' },
    { id: 'enable', label: 'Enable', emoji: '🔓', source: '4-enable' }
  ],
  areas: [
    { id: 'technology', label: 'Technology', emoji: '💡', source: '4-technology' },
    { id: 'policy', label: 'Policy', emoji: '📜', source: '4-policy' },
    { id: 'culture', label: 'Culture', emoji: '🎭', source: '4-culture' }
  ],
  // Arrow connections: which actions connect to which areas
  connections: [
    { from: 'work', to: ['technology', 'policy'] },
    { from: 'volunteer', to: ['policy', 'culture'] },
    { from: 'buy', to: ['technology', 'culture'] },
    { from: 'enable', to: ['technology', 'policy', 'culture'] }
  ]
};

function getConnectionColor(actionId) {
  // Use theme color names for actions, matching other diagrams
  const colors = {
    work: tc('primary17', '#bbf7d0'),      // light green
    volunteer: tc('secondary17', '#b5dced'), // light blue
    buy: tc('accent-yellow', '#fde68a'),    // light yellow (matches solution branches)
    enable: tc('accent-217', '#e4cff1')     // light pink/purple
  };
  return colors[actionId] || tc('GREY100', '#d6d6d6');
}

function initializeActionsDiagram() {
  const container = document.getElementById('actionsDiagram');
  if (!container) return;

  // Clear existing
  container.innerHTML = '';

  const boxWidth = 140;
  const boxHeight = 60;
  const columnSpacing = 380; // Increased from 300 for better readability
  const rowSpacing = 100;
  const topMargin = 30;
  const leftMargin = 30; // Reduced from 50 to shrink overall width
  const svgWidth = 550; // Reduced from 600 to be more compact
  const svgHeight = 450;

  // Create SVG for arrows and boxes (no background/border - transparent)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', svgHeight);
  svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
  svg.setAttribute('style', 'display: block; margin: 0 auto;');

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  
  // Define arrowheads for each action color
  actionsData.actions.forEach(action => {
    const color = getConnectionColor(action.id);
    const markerId = `arrow-${action.id}`;
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', markerId);
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'strokeWidth');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0,0 L0,6 L9,3 z');
    path.setAttribute('fill', color);
    marker.appendChild(path);
    defs.appendChild(marker);
  });

  svg.appendChild(defs);

  // Container for lines (drawn first, behind boxes)
  const linesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  linesGroup.setAttribute('class', 'connections');
  svg.appendChild(linesGroup);

  // Container for boxes
  const boxesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  boxesGroup.setAttribute('class', 'boxes');
  svg.appendChild(boxesGroup);

  // Calculate positions with proper centering
  const actionBoxes = {};
  const areaBoxes = {};

  // Position action boxes (left column) - centered horizontally with leftMargin
  actionsData.actions.forEach((action, idx) => {
    const y = topMargin + idx * rowSpacing;
    actionBoxes[action.id] = { x: leftMargin, y, width: boxWidth, height: boxHeight, ...action };
  });

  // Position area boxes (right column) - centered and spaced properly
  actionsData.areas.forEach((area, idx) => {
    const y = topMargin + idx * rowSpacing + 50; // Offset for 3 items in 4 slots
    areaBoxes[area.id] = { x: leftMargin + columnSpacing, y, width: boxWidth, height: boxHeight, ...area };
  });

  // Function to draw a line between two boxes
  function drawLine(fromBox, toBox, color, visible = false) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromBox.x + fromBox.width);
    line.setAttribute('y1', fromBox.y + fromBox.height / 2);
    line.setAttribute('x2', toBox.x);
    line.setAttribute('y2', toBox.y + toBox.height / 2);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2');
    line.setAttribute('marker-end', `url(#arrow-${fromBox.id})`);
    line.setAttribute('opacity', visible ? '1' : '0');
    line.setAttribute('transition', 'opacity 0.2s');
    line.setAttribute('class', `connection connection-${fromBox.id}`);
    
    // Store reference for hover
    line.dataset.fromAction = fromBox.id;
    line.dataset.toArea = toBox.id;
    
    return line;
  }

  // Draw all connection lines
  const lineMap = {};
  actionsData.connections.forEach(conn => {
    const fromBox = actionBoxes[conn.from];
    const color = getConnectionColor(conn.from);
    
    conn.to.forEach(areaId => {
      const toBox = areaBoxes[areaId];
      const line = drawLine(fromBox, toBox, color, false);
      linesGroup.appendChild(line);
      
      if (!lineMap[conn.from]) lineMap[conn.from] = [];
      lineMap[conn.from].push(line);
    });
  });

  // Function to create a clickable box
  function createBox(boxData, isAction = true) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'box');
    g.setAttribute('cursor', 'pointer');
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', boxData.x);
    rect.setAttribute('y', boxData.y);
    rect.setAttribute('width', boxData.width);
    rect.setAttribute('height', boxData.height);
    rect.setAttribute('rx', '12');
    rect.setAttribute('fill', isAction ? getConnectionColor(boxData.id) : tc('GREY100', '#d6d6d6'));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('opacity', '1');
    rect.setAttribute('class', 'box-rect');
    
    // Emoji on the left side
    const emoji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    emoji.setAttribute('x', boxData.x + 15);
    emoji.setAttribute('y', boxData.y + boxData.height / 2);
    emoji.setAttribute('text-anchor', 'start');
    emoji.setAttribute('dominant-baseline', 'middle');
    emoji.setAttribute('font-size', '24');
    emoji.setAttribute('pointer-events', 'none');
    emoji.textContent = boxData.emoji || '';
    
    // Label text centered in remaining space
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', boxData.x + boxData.width / 2 + 10);
    text.setAttribute('y', boxData.y + boxData.height / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '14');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', '#000000');
    text.setAttribute('pointer-events', 'none');
    text.textContent = boxData.label;
    
    g.appendChild(rect);
    g.appendChild(emoji);
    g.appendChild(text);
    
    // Hover effect: show/highlight connections
    g.addEventListener('mouseenter', function() {
      rect.setAttribute('opacity', '0.9');
      
      if (isAction && lineMap[boxData.id]) {
        // Show lines from this action
        lineMap[boxData.id].forEach(line => {
          line.setAttribute('opacity', '1');
          line.setAttribute('stroke-width', '3');
        });
      } else if (!isAction) {
        // Show lines to this area (from all actions that connect to it)
        Object.keys(lineMap).forEach(actionId => {
          lineMap[actionId].forEach(line => {
            if (line.dataset.toArea === boxData.id) {
              line.setAttribute('opacity', '1');
              line.setAttribute('stroke-width', '3');
            }
          });
        });
      }
    });
    
    g.addEventListener('mouseleave', function() {
      rect.setAttribute('opacity', '1');
      
      if (isAction && lineMap[boxData.id]) {
        lineMap[boxData.id].forEach(line => {
          line.setAttribute('opacity', '0');
          line.setAttribute('stroke-width', '2');
        });
      } else if (!isAction) {
        Object.keys(lineMap).forEach(actionId => {
          lineMap[actionId].forEach(line => {
            if (line.dataset.toArea === boxData.id) {
              line.setAttribute('opacity', '0');
              line.setAttribute('stroke-width', '2');
            }
          });
        });
      }
    });
    
    // Click to open detail page
    g.addEventListener('click', function() {
      if (boxData.source) {
        openDetailPage(document.getElementById('main-content'), boxData.source);
      }
    });
    
    return g;
  }

  // Add action boxes
  actionsData.actions.forEach(action => {
    const box = actionBoxes[action.id];
    boxesGroup.appendChild(createBox(box, true));
  });

  // Add area boxes
  actionsData.areas.forEach(area => {
    const box = areaBoxes[area.id];
    boxesGroup.appendChild(createBox(box, false));
  });

  container.appendChild(svg);
  window.actionsDiagram = { svg, lineMap };
}

// Register reload handler
window.diagramReloadHandlers.push(function() {
  initializeActionsDiagram();
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  initializeActionsDiagram();
});
