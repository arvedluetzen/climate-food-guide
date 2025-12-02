// Problem.md - Multi-view Food System Diagram

// Global diagram reference and state
window.problemDiagram = null;
window.currentDiagramView = "plain";

// Base nodes (always present)
const baseNodes = [
    { key: 1, text: "Plants", baseColor: "#86efac", source: "plants" },
    { key: 2, text: "Animals", baseColor: "#86efac", source: null },
    { key: 3, text: "Processing", baseColor: "#86efac", source: null },
    { key: 4, text: "Food", baseColor: "#86efac", source: null }
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
    { key: 101, text: "Land Use", color: "#f472b6", type: "overlay" },
    { key: 102, text: "Fertilizer", color: "#f472b6", type: "overlay" },
    { key: 103, text: "CO2eq", color: "#f472b6", type: "overlay" },
    { key: 104, text: "Transport", color: "#f472b6", type: "overlay" },
    { key: 105, text: "Comparison", color: "#f472b6", type: "overlay" }
];

// Emissions view overlay links
const emissionsOverlayLinks = [
    { from: 101, to: 1 },
    { from: 102, to: 1 },
    { from: 1, to: 104 },
    { from: 104, to: 2 },
    { from: 104, to: 3 },
    { from: 104, to: 105 },
    { from: 2, to: 105},
    {from: 3, to: 105},
    { from: 105, to: 4 },
    { from: 2, to: 103 }
];

// System view overlay nodes
const systemOverlayNodes = [
    { key: 201, text: "Land", color: "#93c5fd", type: "overlay" },
    { key: 202, text: "Efficiency", color: "#93c5fd", type: "overlay" },
    { key: 203, text: "Choice", color: "#93c5fd", type: "overlay" },
    { key: 204, text: "Waste", color: "#93c5fd", type: "overlay" }
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
        { from: 2, to: 4 },
        { from: 3, to: 4 },
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

// Color themes for base nodes in each view
const viewThemes = {
    plain: {
        1: "#86efac", // Plants - light green
        2: "#86efac", // Animals - light green
        3: "#86efac", // Processing - light green
        4: "#86efac"  // Food - light green
    },
    emissions: {
        1: "#f472b6", // Plants - rose
        2: "#f472b6", // Animals - rose
        3: "#f472b6", // Processing - rose
        4: "#86efac"  // Food - stays green
    },
    system: {
        1: "#86efac", // Plants - green (base)
        2: "#86efac", // Animals - green (base)
        3: "#86efac", // Processing - green (base)
        4: "#86efac"  // Food - green (base)
    }
};

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
        allowDelete: false
    });

    diagram.nodeTemplate =
    new go.Node("Auto")
        .add(
        new go.Shape("RoundedRectangle")
            .bind("fill", "color"),
        new go.TextBlock({ margin: 8, font: "12px sans-serif", textAlign: "center", wrap: go.TextBlock.WrapDesiredSize })
            .bind("text"),
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
        new go.Shape({ strokeWidth: 2, stroke: "#555" }),
        new go.Shape({ toArrow: "Standard", strokeWidth: 0, fill: "#555" })
        );

    // Initialize with base nodes and links
    const initialNodes = baseNodes.map(n => ({...n, color: viewThemes.plain[n.key]}));
    
    diagram.model = new go.GraphLinksModel(initialNodes, baseLinks);
    diagram.undoManager.isEnabled = true;
    
    window.problemDiagram = diagram;
    window.currentDiagramView = "plain";
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
            const newColor = viewThemes[view][baseNode.key];
            model.setDataProperty(nodeInModel, "color", newColor);
        }
    });
    
    window.currentDiagramView = view;
    diagram.commitTransaction("switch view to " + view);
    
    // Update button styles to show active view
    updateViewButtonStyles(view);
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
    }
    
    // Re-attach event listeners to buttons
    attachButtonEventListeners();
    
    // Call any other diagram reload handlers (e.g., solutions diagram)
    if (window.diagramReloadHandlers && Array.isArray(window.diagramReloadHandlers)) {
        window.diagramReloadHandlers.forEach(fn => {
            try { fn(); } catch (e) { console.error('diagramReloadHandler error', e); }
        });
    }
};



