// Navigation history stack for returning to previous views
window.navigationHistory = [];
window.savedScrollY = 0;

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  
  // Initialize history with the original page content
  window.navigationHistory.push({
    content: mainContent.innerHTML,
    timestamp: Date.now()
  });

  document.addEventListener('click', async (e) => {
    // Check for data-detail attribute (SVG nodes, buttons, etc.)
    const target = e.target.closest('[data-detail]');
    if (target) {
      const page = target.getAttribute('data-detail');
      const source = target.getAttribute('data-source') || `${page}`;
      await openDetailPage(mainContent, source);
      return;
    }

    // Check for data-source attribute (GoJS nodes)
    const sourceTarget = e.target.closest('[data-source]');
    if (sourceTarget) {
      const source = sourceTarget.getAttribute('data-source');
      await openDetailPage(mainContent, source);
    }
  });

  // Setup close button handler (event delegation, robust to inner SVG clicks)
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('#close-detail');
    if (closeBtn) {
      goBackToPreviousView(mainContent);
    }
  });
});

/**
 * Opens a detail page and saves current state to history
 * @param {Element} mainContent - The main content container
 * @param {string} source - The page source (e.g., 'plants' or 'details/plants')
 */
async function openDetailPage(mainContent, source) {
  try {
    // Save current scroll position before navigating
    window.savedScrollY = window.scrollY;
    
    // Save current state before navigating (include current diagram views)
    window.navigationHistory.push({
      content: mainContent.innerHTML,
      timestamp: Date.now(),
      diagramStates: {
        problem: window.currentDiagramView,
        solution: window.currentSolutionState
      }
    });

    // Normalize the source path to built HTML
    const path = source.startsWith('details/') ? source : `details/${source}`;
    const cleanPath = path.endsWith('.md') ? path.replace('.md', '') : path;

    // Use window.BASE_URL set in the page (falls back to '/') so
    // fetches work both locally and on GitHub Pages subpaths.
    const base = (typeof window !== 'undefined' && window.BASE_URL) ? window.BASE_URL : '/';
    const url = `${base}${cleanPath}/index.html`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    
    const html = await response.text();
    
    // The fetched HTML is just the content inside main-content (from detail.njk)
    // It's already rendered with markdown and styled, so insert it directly
    mainContent.innerHTML = html;
    
    // Scroll to top of detail page
    window.scrollTo(0, 0);
    
    // Re-run any scripts in the detail page if needed
    // This allows detail pages to have their own interactivity
    reloadScripts(mainContent);
  } catch (error) {
    console.error('Error loading detail page:', error);
    mainContent.innerHTML = '<p class="text-red-500">Error loading detail page. Please try again.</p>';
  }
}

/**
 * Goes back to the previous view in the navigation history
 * @param {Element} mainContent - The main content container
 */
function goBackToPreviousView(mainContent) {
  if (window.navigationHistory.length > 1) {
    window.navigationHistory.pop(); // Remove current detail state
    const previousState = window.navigationHistory[window.navigationHistory.length - 1];
    mainContent.innerHTML = previousState.content;
    
    // If the previous state included diagram views, restore them before reloading
    if (previousState.diagramStates) {
      if (previousState.diagramStates.problem) window.currentDiagramView = previousState.diagramStates.problem;
      if (previousState.diagramStates.solution) window.currentSolutionState = previousState.diagramStates.solution;
    }

    // Re-run diagrams script to reinitialize them
    if (window.reloadDiagrams) {
      window.reloadDiagrams();
    }

    // Restore the saved scroll position after a small delay for rendering
    setTimeout(() => {
      window.scrollTo(0, window.savedScrollY);
    }, 200);
  }
}

/**
 * Re-runs script tags in a given element to enable interactivity
 * @param {Element} element - The element containing scripts to reload
 */
function reloadScripts(element) {
  const scripts = element.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    newScript.innerHTML = oldScript.innerHTML;
    if (oldScript.src) newScript.src = oldScript.src;
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}





