// Problem.md - Multi-view Food System Diagram

// Global diagram reference and state
window.problemDiagram = null;
window.currentDiagramView = "plain";

// View descriptions
const viewDescriptions = {
    plain: "This is the most basic representation of how human food is made.",
    emissions: "Find out where greenhouse gases are emitted in the food production process.",
    system: "Learn some additional important dynamics that shape how food is produced."
};

// View colors for description background
const viewColors = {
    plain: "var(--primary17)",
    emissions: "var(--accent-217)",
    system: "var(--secondary17)"
};

// Helper to read theme colors with a fallback
function tc(name, fallback) {
    return (window.themeColors && window.themeColors[name]) || fallback;
}

// Base nodes (always present)
const baseNodes = [
    { key: 1, text: "Plants", emoji: "🌱", baseColor: tc('primary17', '#bbf7d0'), source: "2-plants" },
    { key: 2, text: "Animals", emoji: "🐄", baseColor: tc('primary17', '#bbf7d0'), source: "2-animals" },
    { key: 3, text: "Processing", emoji: "⚙️", baseColor: tc('primary17', '#bbf7d0'), source: "2-processing" },
    { key: 4, text: "Food", emoji: "🍽️", baseColor: tc('primary17', '#bbf7d0'), source: "2-food-comp" }
];

// Base links
const baseLinks = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 4 },
    { from: 3, to: 4 }
];

// Emissions view overlay nodes
const emissionsOverlayNodes = [
    { key: 101, text: "Land Use", emoji: "🌍", color: tc('accent-217', '#fbcfe8'), type: "overlay", source: "2-landuse" },
    { key: 102, text: "Fertilizer", emoji: "🧪", color: tc('accent-217', '#fbcfe8'), type: "overlay", source: "2-fertilizer" },
    { key: 103, text: "CO2eq", emoji: "💨", color: tc('accent-217', '#fbcfe8'), type: "overlay", source: "2-CO2eq" },
    { key: 104, text: "Transport", emoji: "🚚", color: tc('accent-217', '#fbcfe8'), type: "overlay", source: "2-transport" },
];

// Emissions view overlay links
const emissionsOverlayLinks = [
    { from: 101, to: 1 },
    { from: 102, to: 1 },
    { from: 1, to: 104 },
    { from: 104, to: 2 },
    { from: 104, to: 3 },
    { from: 104, to: 4 },
    { from: 2, to: 103 }
];

// System view overlay nodes
const systemOverlayNodes = [
    { key: 201, text: "Land", emoji: "🌍", color: tc('secondary17', '#dbeafe'), type: "overlay", source: "2-land-requirement" },
    { key: 202, text: "Efficiency", emoji: "⚡", color: tc('secondary17', '#dbeafe'), type: "overlay", source: "2-production-efficiency" },
    { key: 203, text: "Choice", emoji: "🤔", color: tc('secondary17', '#dbeafe'), type: "overlay", source: "2-choice" },
    { key: 204, text: "Waste", emoji: "🗑️", color: tc('secondary17', '#dbeafe'), type: "overlay", source: "3-foodwaste" }
];

// System view overlay links
const systemOverlayLinks = [
    { from: 201, to: 1 },
    { from: 1, to: 202 },
    { from: 202, to: 2 },
    { from: 202, to: 3 },
    { from: 202, to: 203 },
    { from: 3, to: 203 },
    { from: 2, to: 203 },
    { from: 203, to: 4 },
    { from: 4, to: 204 }
];

// Base links that should be removed in certain views
const baseLinksToRemove = {
    emissions: [
        { from: 1, to: 4 },
        { from: 1, to: 2 },
        { from: 1, to: 3 }
    ],
    system: [
        { from: 1, to: 2},
        { from: 1, to: 3 },
        { from: 1, to: 4 },
        { from: 2, to: 4 },
        { from: 3, to: 4 },
    ]
};

// Color themes for base nodes in each view (read from themeColors when available)
function getViewThemes() {
    return {
        plain: {
            1: tc('primary17', '#bbf7d0'),
            2: tc('primary17', '#bbf7d0'),
            3: tc('primary17', '#bbf7d0'),
            4: tc('primary17', '#bbf7d0')
        },
        emissions: {
            1: tc('accent-217', '#fbcfe8'),
            2: tc('accent-217', '#fbcfe8'),
            3: tc('accent-217', '#fbcfe8'),
            4: tc('accent-217', '#fbcfe8')
        },
        system: {
            1: tc('primary17', '#bbf7d0'),
            2: tc('primary17', '#bbf7d0'),
            3: tc('primary17', '#bbf7d0'),
            4: tc('primary17', '#bbf7d0')
        }
    };
}

function initializeProblemDiagram() {
    const diagramDiv = document.getElementById("problemDiagram");
    if (!diagramDiv) return; // Exit if diagram container doesn't exist
    
    // Clear any existing diagram
    if (diagramDiv.firstChild) {
        diagramDiv.innerHTML = '';
    }
    
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, "problemDiagram", {
        layout: $(go.LayeredDigraphLayout),
        allowDelete: false,
        scrollMode: go.Diagram.XYScroll,
        'toolManager.mouseWheelBehavior': go.ToolManager.WheelNone
    });

    diagram.nodeTemplate =
    new go.Node("Auto")
        .add(
        new go.Shape("RoundedRectangle")
            .bind("fill", "color"),
        new go.Panel("Vertical", {
            margin: 8,
            alignment: go.Spot.Center,
            defaultAlignment: go.Spot.Center
        })
            .add(
                new go.TextBlock({ 
                    font: "36px sans-serif", 
                    margin: 2,
                    textAlign: "center"
                })
                    .bind("text", "emoji"),
                new go.TextBlock({ 
                    margin: 4, 
                    font: "12px sans-serif", 
                    textAlign: "center",
                    stroke: "#000000",
                    wrap: go.TextBlock.WrapDesiredSize,
                    maxSize: new go.Size(90, NaN)
                })
                    .bind("text")
            )
    );
    
    diagram.nodeTemplate.click = function(e, node) {
        // Check if the node has a source property and it's not null
        if (node.data && node.data.source) {
            openDetailPage(document.getElementById('main-content'), node.data.source);
        }
    };

    diagram.linkTemplate =
    new go.Link({ routing: go.Routing.Normal, corner: 0 })
        .add(
        new go.Shape({ strokeWidth: 3, stroke: tc('GREY500', '#555') }), // Slightly increased line width
        new go.Shape({ toArrow: "Standard", strokeWidth: 0, fill: tc('GREY500', '#555'), scale: 2 }) // Increased arrow size
        );

    // Initialize with base nodes and links
    const viewThemes = getViewThemes();
    const initialNodes = baseNodes.map(n => ({...n, color: viewThemes.plain[n.key]}));
    
    diagram.model = new go.GraphLinksModel(initialNodes, baseLinks);
    diagram.undoManager.isEnabled = true;
    
    // Auto-scale diagram to fit container (smooth)
        setTimeout(() => {
            smoothZoomToFit(diagram, 350);
        }, 100);
    
    window.problemDiagram = diagram;
    window.currentDiagramView = "plain";
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

/**
 * Helper function to remove links by their from/to properties
 * @param {GoJS.Model} model - The diagram model
 * @param {Array} linksToRemove - Array of {from, to} objects
 */
function removeLinksFromModel(model, linksToRemove) {
    linksToRemove.forEach(linkToRemove => {
        // Find the link in the model by matching from and to
        const linkInModel = model.linkDataArray.find(
            l => l.from === linkToRemove.from && l.to === linkToRemove.to
        );
        if (linkInModel) {
            model.removeLinkData(linkInModel);
        }
    });
}

/**
 * Helper function to add links, checking if they already exist
 * @param {GoJS.Model} model - The diagram model
 * @param {Array} linksToAdd - Array of {from, to} objects
 */
function addLinksToModel(model, linksToAdd) {
    linksToAdd.forEach(linkToAdd => {
        // Check if link already exists before adding
        const exists = model.linkDataArray.some(
            l => l.from === linkToAdd.from && l.to === linkToAdd.to
        );
        if (!exists) {
            model.addLinkData(linkToAdd);
        }
    });
}

/**
 * Switch the diagram view between plain, emissions, and system
 * @param {string} view - The view to switch to: "plain", "emissions", or "system"
 */
function switchDiagramView(view) {
    if (!window.problemDiagram) return;
    if (window.currentDiagramView === view) return; // Already on this view
    
    const diagram = window.problemDiagram;
    const model = diagram.model;
    
    diagram.startTransaction("switch view to " + view);
    
    // First, restore all base links if coming from a view that removed them
    if (window.currentDiagramView === "emissions" && baseLinksToRemove.emissions) {
        addLinksToModel(model, baseLinksToRemove.emissions);
    } else if (window.currentDiagramView === "system" && baseLinksToRemove.system) {
        addLinksToModel(model, baseLinksToRemove.system);
    }
    
    // Remove overlay nodes and links from current view
    if (window.currentDiagramView === "emissions") {
        removeLinksFromModel(model, emissionsOverlayLinks);
        emissionsOverlayNodes.forEach(node => model.removeNodeData(node));
    } else if (window.currentDiagramView === "system") {
        removeLinksFromModel(model, systemOverlayLinks);
        systemOverlayNodes.forEach(node => model.removeNodeData(node));
    }
    
    // Remove base links that conflict with the new view
    if (view === "emissions" && baseLinksToRemove.emissions) {
        removeLinksFromModel(model, baseLinksToRemove.emissions);
    } else if (view === "system" && baseLinksToRemove.system) {
        removeLinksFromModel(model, baseLinksToRemove.system);
    }
    
    // Add overlay nodes and links for new view
    if (view === "emissions") {
        emissionsOverlayNodes.forEach(node => model.addNodeData(node));
        addLinksToModel(model, emissionsOverlayLinks);
    } else if (view === "system") {
        systemOverlayNodes.forEach(node => model.addNodeData(node));
        addLinksToModel(model, systemOverlayLinks);
    }
    
    // Update colors for base nodes by finding them in the model and updating their data
    baseNodes.forEach(baseNode => {
        const nodeInModel = model.nodeDataArray.find(n => n.key === baseNode.key);
        if (nodeInModel) {
            const newColor = getViewThemes()[view][baseNode.key];
            model.setDataProperty(nodeInModel, "color", newColor);
        }
    });
    
    window.currentDiagramView = view;
    diagram.commitTransaction("switch view to " + view);
    // Recenter and scale diagram to fit after the view change
        setTimeout(() => {
            smoothZoomToFit(diagram, 350);
        }, 350);

    // Update button styles to show active view
    updateViewButtonStyles(view);
    
    // Update description
    updateViewDescription(view);
}

/**
 * Update the description text based on the current view
 * @param {string} view - The current view: "plain", "emissions", or "system"
 */
function updateViewDescription(view) {
    const descriptionElement = document.getElementById('viewDescription');
    if (descriptionElement && viewDescriptions[view]) {
        const paragraph = descriptionElement.querySelector('p');
        if (paragraph) {
            paragraph.textContent = viewDescriptions[view];
        }
        // Update background color to match the view
        if (viewColors[view]) {
            descriptionElement.style.backgroundColor = viewColors[view];
        }
    }
}

/**
 * Update the visual style of view toggle buttons
 * @param {string} activeView - The currently active view
 */
function updateViewButtonStyles(activeView) {
    const buttons = document.querySelectorAll('.diagram-view-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-view') === activeView) {
            btn.classList.add('active');
            btn.classList.remove('inactive');
        } else {
            btn.classList.remove('active');
            btn.classList.add('inactive');
        }
    });
}

/**
 * Attach event listeners to view toggle buttons
 */
function attachButtonEventListeners() {
    const viewButtons = document.querySelectorAll('.diagram-view-btn');
    viewButtons.forEach(btn => {
        // Remove any existing listeners by cloning the element
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add fresh listener
        newBtn.addEventListener('click', (e) => {
            const view = e.target.getAttribute('data-view');
            switchDiagramView(view);
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initializeProblemDiagram();
    attachButtonEventListeners();
    updateViewButtonStyles("plain");
    updateViewDescription("plain");
});

// Make diagram reloadable when returning from detail pages
window.reloadDiagrams = function() {
    const savedView = window.currentDiagramView;
    initializeProblemDiagram();
    
    // Restore the previous view
    if (savedView !== "plain") {
        switchDiagramView(savedView);
    } else {
        updateViewButtonStyles("plain");
        updateViewDescription("plain");
    }
    
    // Re-attach event listeners to buttons
    attachButtonEventListeners();
    
    // Call any other diagram reload handlers (e.g., solutions diagram)
    if (window.diagramReloadHandlers && Array.isArray(window.diagramReloadHandlers)) {
        window.diagramReloadHandlers.forEach(fn => {
            try { fn(); } catch (e) { console.error('diagramReloadHandler error', e); }
        });
    }
    // Ensure diagram is centered after reload
    setTimeout(() => {
        try { if (window.problemDiagram) smoothZoomToFit(window.problemDiagram, 350); } catch (e) {}
    }, 120);
};



