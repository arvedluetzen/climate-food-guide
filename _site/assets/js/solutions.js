// Solutions decision-tree diagram
window.solutionDiagram = null;
window.selectedPath = []; // Track path: [1000, 1001, 1101] means root -> Consumption -> Different
window.visibleNodes = new Set(); // Track which nodes should be visible
window.diagramReloadHandlers = window.diagramReloadHandlers || [];

// Full tree nodes with single root
const solutionsNodes = [
  { key: 1000, text: 'What could we change?', emoji: '❓', type: 'root' },

  { key: 1001, text: 'Consumption', emoji: '🍴', type: 'branch' },
  { key: 1002, text: 'Production', emoji: '🏭', type: 'branch' },

  // Consumption children
  { key: 1110, text: 'eating DIFFERENT food', emoji: '🔄', type: 'branch' },
  { key: 1120, text: 'REDUCING demand', emoji: '📉️', type: 'branch' },

  // Production children
  { key: 1210, text: 'making it more EFFICIENCY', emoji: '⚡', type: 'branch' },
  { key: 1220, text: 'finding DIFFERENT processes', emoji: '🧫', type: 'branch' },

  // Sample leaf articles for each branch
  { key: 2111, text: 'Impact?', emoji: '📄', type: 'leaf', source: '1-emissions-overview' },
  { key: 2112, text: 'How?', emoji: '📄', type: 'leaf', source: 'plants' },
  { key: 2121, text: 'Foodwaste', emoji: '📄', type: 'leaf' },
  { key: 2122, text: 'Demand', emoji: '📄', type: 'leaf' },
  { key: 2211, text: 'Plants', emoji: '📄', type: 'leaf' },
  { key: 2212, text: 'Animals', emoji: '📄', type: 'leaf' },
  { key: 2213, text: 'Electrify', emoji: '📄', type: 'leaf' },
  { key: 2221, text: 'Idea!', emoji: '📄', type: 'leaf' },
  { key: 2222, text: 'How?', emoji: '📄', type: 'leaf' },
  { key: 2223, text: 'Price?', emoji: '📄', type: 'leaf' },
  { key: 2224, text: 'Demand?', emoji: '📄', type: 'leaf' }
];

// Links: connect roots -> branches -> leaves
const solutionsLinks = [
  { from: 1000, to: 1001 },
  { from: 1000, to: 1002 },
  { from: 1001, to: 1110 },
  { from: 1001, to: 1120 },
  { from: 1002, to: 1210 },
  { from: 1002, to: 1220 },

  // attach sample leaves
  { from: 1110, to: 2111 },
  { from: 1110, to: 2112 },
  { from: 1120, to: 2121 },
  { from: 1120, to: 2122 },
  { from: 1210, to: 2211 },
  { from: 1210, to: 2212 },
  { from: 1210, to: 2213 },
  { from: 1220, to: 2221 },
  { from: 1220, to: 2222 },
  { from: 1220, to: 2223 },
  { from: 1220, to: 2224 }
];

function getNodeColor(node) {
  // Try to read colors from themeColors, fall back to previous hard-coded values
  const tc = (name, fallback) => (window.themeColors && window.themeColors[name]) || fallback;
  if (node.type === 'root') return tc('primary17', '#bbf7d0');
  if (node.type === 'branch') return tc('accent-yellow', '#fef3c7');
  if (node.type === 'leaf') return tc('secondary33', '#dbeafe');
  return tc('GREY100', '#e5e7eb');
}

function createDiagramNodeTemplate() {
  const $ = go.GraphObject.make;

  const template = new go.Node('Auto')
    .set({ locationSpot: go.Spot.Center })
    .add(
      new go.Shape('RoundedRectangle')
        .bind('fill', 'color')
        .bind('opacity', 'isVisible', v => v ? 1 : 0),
      new go.TextBlock({
        font: '42px sans-serif',
        margin: new go.Margin(20, 28, 20, 28),
        textAlign: 'center',
        stroke: '#000000',
        wrap: go.TextBlock.WrapDesiredSize
      })
        .bind('text', '', d => (d && d.emoji ? (d.emoji + ' ' + (d.text || '')) : (d.text || '')))
        .bind('opacity', 'isVisible', v => v ? 1 : 0)
        .bind('maxSize', 'key', k => k === 1000 ? new go.Size(NaN, NaN) : new go.Size(2000, NaN))
    );
  // Support manual positioning via data.loc if present
  template.bind(new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify));

  // Add click handler to template
  template.click = function(e, node) {
    const data = node.data;
    console.debug('[solutions] click', data);
    // Only allow clicks on visible nodes
    if (!data.isVisible) return;
    
    if (data.type === 'leaf' && data.source) {
      // Save the current path before opening detail page
      window.savedSolutionPath = window.selectedPath;
      // Open detail page
      openDetailPage(document.getElementById('main-content'), data.source);
    } else if (data.type !== 'leaf') {
      // Click on branch or root node - update selected path and show subtree
      console.debug('[solutions] selectNode', data.key);
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
  console.debug('[solutions] selectNode called', nodeKey);
  // Build path from root to selected node
  const newPath = [];
  let current = nodeKey;
  while (current !== null) {
    newPath.unshift(current);
    current = getParentOf(current);
  }

  window.selectedPath = newPath;
  console.debug('[solutions] newPath', newPath);
  rebuildDiagramForSelection();
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

  // Do not trigger a relayout or animation; preserve positions
  // This avoids confusing movement when toggling visibility
  // If needed later, a manual zoomToFit without animation can be applied
  // diagram.layoutDiagram(false);
}

function computeVisibleSetFromPath(path) {
  const nodesToShow = new Set();
  const root = solutionsNodes.find(n => n.type === 'root');
  nodesToShow.add(root.key);

  for (let i = 0; i < path.length; i++) {
    const currentKey = path[i];
    const parentKey = i > 0 ? path[i - 1] : null;
    nodesToShow.add(currentKey);
    if (parentKey !== null) {
      const siblings = getChildrenOf(parentKey);
      siblings.forEach(k => nodesToShow.add(k));
    }
    if (i === path.length - 1) {
      const children = getChildrenOf(currentKey);
      children.forEach(childKey => {
        nodesToShow.add(childKey);
        if (path.length >= 3) {
          const gcs = getChildrenOf(childKey);
          gcs.forEach(gc => nodesToShow.add(gc));
        }
      });
    }
  }
  return nodesToShow;
}

function rebuildDiagramForSelection() {
  const diagram = window.solutionDiagram;
  if (!diagram) return;
  console.debug('[solutions] rebuildDiagramForSelection start');

  const path = window.selectedPath && window.selectedPath.length ? window.selectedPath : [1000];
  const nodesToShow = computeVisibleSetFromPath(path);
  console.debug('[solutions] nodesToShow', Array.from(nodesToShow));
  window.visibleNodes = nodesToShow;

  // Capture previous positions to preserve shared nodes
  const prevPositions = new Map();
  solutionsNodes.forEach(n => {
    const part = diagram.findPartForKey(n.key);
    if (part && part.location) {
      prevPositions.set(n.key, part.location.copy());
    }
  });

  // Build model arrays containing only visible nodes/links
  const nodeArray = solutionsNodes
    .filter(n => nodesToShow.has(n.key))
    .map(n => ({
      ...n,
      color: getNodeColor(n),
      isVisible: true
    }));

  const linkArray = solutionsLinks.filter(l => nodesToShow.has(l.from) && nodesToShow.has(l.to));

  // Replace model after the click transaction completes to avoid errors
  setTimeout(() => {
    const newModel = new go.GraphLinksModel(nodeArray, linkArray);
    diagram.model = newModel;
    console.debug('[solutions] model replaced', nodeArray.length, linkArray.length);

    // Restore positions for nodes present in both versions
    diagram.nodes.each(node => {
      const key = node.data.key;
      const prev = prevPositions.get(key);
      if (prev) {
        node.location = prev;
      } else {
        // For new nodes, position near parent to keep things sensible
        const parentKey = getParentOf(key);
        const parentPart = parentKey != null ? diagram.findPartForKey(parentKey) : null;
        const base = parentPart && parentPart.location ? parentPart.location.copy() : new go.Point(0, 0);
        const idx = getChildrenOf(parentKey || key).indexOf(key);
        node.location = new go.Point(base.x + (idx * 260), base.y + 150);
      }
    });

    // Ensure links are visible in the subgraph
    diagram.links.each(link => {
      diagram.model.setDataProperty(link.data, 'isVisible', true);
    });

    // Run a quick non-animated layout and fit once to center content nicely
    try { diagram.layoutDiagram(false); } catch (e) {}
    try { diagram.zoomToFit(); } catch (e) {}
  }, 0);
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
      nodeSpacing: 60,
      layerSpacing: 120
    }),
    'undoManager.isEnabled': true,
    initialContentAlignment: go.Spot.Center,
    scrollMode: go.Diagram.XYScroll,
    'toolManager.mouseWheelBehavior': go.ToolManager.WheelNone
  });

  // Disable animations to prevent confusing rebuild motion
  diagram.animationManager.isEnabled = false;
  if (go.AnimationManager && diagram.animationManager) {
    diagram.animationManager.initialAnimationStyle = go.AnimationManager.None;
  }

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
    // Fit once on init without animation to get viewport bounds
    try { diagram.zoomToFit(); } catch (e) {}

  }, 100);

  // Immediately apply the same centering behavior as clicking the parent once
  setTimeout(() => {
    try { selectNode(1000); } catch (e) {}
  }, 120);
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
