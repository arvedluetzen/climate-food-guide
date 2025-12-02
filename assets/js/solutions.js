// Solutions decision-tree diagram
window.solutionDiagram = null;
window.selectedPath = []; // Track path: [1000, 1001, 1101] means root -> Consumption -> Different
window.visibleNodes = new Set(); // Track which nodes should be visible
window.diagramReloadHandlers = window.diagramReloadHandlers || [];

// Full tree nodes with single root
const solutionsNodes = [
  { key: 1000, text: 'What could we change?', type: 'root' },

  { key: 1001, text: 'Consumption', type: 'branch' },
  { key: 1002, text: 'Production', type: 'branch' },

  // Consumption children
  { key: 1101, text: 'Different', type: 'branch' },
  { key: 1102, text: 'Less', type: 'branch' },

  // Production children
  { key: 1201, text: 'Efficiency', type: 'branch' },
  { key: 1202, text: 'Different', type: 'branch' },

  // Sample leaf articles for each branch
  { key: 2001, text: 'Article A', type: 'leaf', source: '1-emissions-overview' },
  { key: 2002, text: 'Article B', type: 'leaf', source: 'plants' },
  { key: 2003, text: 'Article C', type: 'leaf' },
  { key: 2004, text: 'Article D', type: 'leaf' }
];

// Links: connect roots -> branches -> leaves
const solutionsLinks = [
  { from: 1000, to: 1001 },
  { from: 1000, to: 1002 },
  { from: 1001, to: 1101 },
  { from: 1001, to: 1102 },
  { from: 1002, to: 1201 },
  { from: 1002, to: 1202 },

  // attach sample leaves
  { from: 1101, to: 2001 },
  { from: 1101, to: 2002 },
  { from: 1201, to: 2003 },
  { from: 1202, to: 2004 }
];

function getNodeColor(node) {
  // Try to read colors from themeColors, fall back to previous hard-coded values
  const tc = (name, fallback) => (window.themeColors && window.themeColors[name]) || fallback;
  if (node.type === 'root') return tc('primary17', '#bbf7d0');
  if (node.type === 'branch') return tc('secondary33', '#bfdbfe');
  if (node.type === 'leaf') return tc('accent-yellow', '#fde68a');
  return tc('GREY100', '#e5e7eb');
}

function createDiagramNodeTemplate() {
  const $ = go.GraphObject.make;

  const template = new go.Node('Auto')
    .add(
      new go.Shape('RoundedRectangle')
        .bind('fill', 'color')
        .bind('opacity', 'isVisible', v => v ? 1 : 0),
      new go.TextBlock({ 
        margin: 8, 
        font: '13px sans-serif',
        textAlign: 'center',
        wrap: go.TextBlock.WrapDesiredSize,
        maxSize: new go.Size(100, NaN)
      })
        .bind('text')
        .bind('opacity', 'isVisible', v => v ? 1 : 0)
    );

  // Add click handler to template
  template.click = function(e, node) {
    const data = node.data;
    // Only allow clicks on visible nodes
    if (!data.isVisible) return;
    
    if (data.type === 'leaf' && data.source) {
      // Save the current path before opening detail page
      window.savedSolutionPath = window.selectedPath;
      // Open detail page
      openDetailPage(document.getElementById('main-content'), data.source);
    } else if (data.type !== 'leaf') {
      // Click on branch or root node - update selected path and show subtree
      selectNode(data.key);
    }
  };

  return template;
}

function getParentOf(nodeKey) {
  const link = solutionsLinks.find(l => l.to === nodeKey);
  return link ? link.from : null;
}

function getChildrenOf(nodeKey) {
  return solutionsLinks.filter(l => l.from === nodeKey).map(l => l.to);
}

/**
 * Select a node and build the view:
 * - Always show root
 * - Show all ancestors up to selected node
 * - Show all siblings at each level of the path
 * - For selected node, show its direct children
 * - Only show grandchildren for selected branches (not for non-selected siblings)
 */
function selectNode(nodeKey) {
  // Build path from root to selected node
  const newPath = [];
  let current = nodeKey;
  while (current !== null) {
    newPath.unshift(current);
    current = getParentOf(current);
  }

  window.selectedPath = newPath;
  updateTreeVisibility();
}

function updateTreeVisibility() {
  const diagram = window.solutionDiagram;
  if (!diagram) return;

  const nodesToShow = new Set();
  const root = solutionsNodes.find(n => n.type === 'root');
  nodesToShow.add(root.key);

  // Build visible nodes by walking the selected path
    for (let i = 0; i < window.selectedPath.length; i++) {
    const currentKey = window.selectedPath[i];
    const parentKey = i > 0 ? window.selectedPath[i - 1] : null;

    // Add the current node
    nodesToShow.add(currentKey);

    // If there's a parent, add all siblings of current
    if (parentKey !== null) {
      const siblingsAndSelf = getChildrenOf(parentKey);
      siblingsAndSelf.forEach(sibKey => {
        nodesToShow.add(sibKey);
      });
    }

    // For the last (selected) node in path, add its children and grandchildren
      if (i === window.selectedPath.length - 1) {
        const childrenKeys = getChildrenOf(currentKey);
        childrenKeys.forEach(childKey => {
          nodesToShow.add(childKey);
          // Reveal grandchildren only when user selected a level-2 node (path length >= 3)
          if (window.selectedPath.length >= 3) {
            const grandchildrenKeys = getChildrenOf(childKey);
            grandchildrenKeys.forEach(gcKey => {
              nodesToShow.add(gcKey);
            });
          }
        });
    }
  }

  window.visibleNodes = nodesToShow;

  // Update all nodes with isVisible flag - smooth animation via binding
  diagram.model.nodeDataArray.forEach(nodeData => {
    diagram.model.setDataProperty(nodeData, 'isVisible', nodesToShow.has(nodeData.key));
  });

  // Update each link's isVisible flag based on the updated node visibility
  diagram.model.linkDataArray.forEach(linkData => {
    const shouldShow = nodesToShow.has(linkData.from) && nodesToShow.has(linkData.to);
    diagram.model.setDataProperty(linkData, 'isVisible', shouldShow);
  });

  // Smooth layout animation
  diagram.layoutDiagram(true);
}

function initializeSolutionDiagram() {
  const diagramDiv = document.getElementById('solutionDiagram');
  if (!diagramDiv) return;

  // Clear existing
  diagramDiv.innerHTML = '';

  const $ = go.GraphObject.make;
  const diagram = $(go.Diagram, 'solutionDiagram', {
    layout: $(go.TreeLayout, { 
      angle: 90, 
      arrangement: go.TreeLayout.ArrangementHorizontal,
      nodeSpacing: 40,
      layerSpacing: 80
    }),
    'undoManager.isEnabled': true,
    scrollMode: go.Diagram.XYScroll,
    'toolManager.mouseWheelBehavior': go.ToolManager.WheelNone
  });

  // Use the template function that includes click handler
  diagram.nodeTemplate = createDiagramNodeTemplate();

  // Link template: use a link-level 'isVisible' property so arrows hide/show cleanly
  diagram.linkTemplate = $(go.Link, { routing: go.Link.Orthogonal, corner: 5 },
    $(go.Shape, { strokeWidth: 2, stroke: (window.themeColors && window.themeColors.GREY500) || '#666' }, new go.Binding('opacity', 'isVisible', v => v ? 1 : 0)),
    $(go.Shape, { toArrow: 'Standard', strokeWidth: 0, fill: (window.themeColors && window.themeColors.GREY500) || '#666' }, new go.Binding('opacity', 'isVisible', v => v ? 1 : 0))
  );

  // Initialize with full tree - all nodes and links, but only some visible
  const initialNodes = solutionsNodes.map(n => ({ 
    ...n, 
    color: getNodeColor(n),
    isVisible: n.key === 1000 || n.key === 1001 || n.key === 1002 // Show root + first level initially
  }));

  window.visibleNodes = new Set([1000, 1001, 1002]);
  // Create initial link data with isVisible based on initial node visibility
  const initialLinks = solutionsLinks.map(l => ({
    ...l,
    isVisible: initialNodes.some(n => n.key === l.from && n.isVisible) && initialNodes.some(n => n.key === l.to && n.isVisible)
  }));
  diagram.model = new go.GraphLinksModel(initialNodes, initialLinks);

  window.solutionDiagram = diagram;
  window.selectedPath = [1000];
  
  // Auto-scale diagram to fit container
  setTimeout(() => {
    smoothZoomToFit(diagram, 350);
  }, 100);
}

// Smoothly animate diagram to fit the viewport without a jump
function smoothZoomToFit(diagram, duration = 400) {
  if (!diagram) return;
  try {
    const oldScale = diagram.scale;
    const oldPos = diagram.position.copy();
    // Apply zoomToFit to compute target scale/position
    diagram.zoomToFit();
    const targetScale = diagram.scale;
    const targetPos = diagram.position.copy();
    // Revert to old values
    diagram.scale = oldScale;
    diagram.position = oldPos;
    // Animate to target
    const anim = new go.Animation();
    anim.add(diagram, 'scale', oldScale, targetScale);
    anim.add(diagram, 'position', oldPos, targetPos);
    anim.duration = duration;
    anim.start();
  } catch (e) {
    try { diagram.zoomToFit(); } catch (ex) { }
  }
}

// Register reload handler so main reload function will call this when restoring
window.diagramReloadHandlers = window.diagramReloadHandlers || [];
window.diagramReloadHandlers.push(function() {
  // Re-initialize diagram when returning from detail page
  initializeSolutionDiagram();
  // Restore the selected path if it was saved
  if (window.savedSolutionPath && window.savedSolutionPath.length > 1) {
    window.selectedPath = window.savedSolutionPath;
    updateTreeVisibility();
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  initializeSolutionDiagram();
});
