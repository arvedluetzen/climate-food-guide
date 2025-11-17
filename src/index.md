---
layout: layout.njk
title: Climate Food Guide
---

<section class="py-12">
  <h2 class="text-2xl font-bold mb-6">Food System Overview</h2>

  <!-- SVG Framework -->
  <div class="flex justify-center mb-8">
    <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
      <!-- Plants -->
      <rect x="50" y="50" width="100" height="50" fill="#4ade80" />
      <text x="100" y="80" text-anchor="middle" fill="white">Plants</text>

      <!-- Arrows -->
      <line x1="150" y1="75" x2="250" y2="75" stroke="black" marker-end="url(#arrow)" />
      <line x1="150" y1="75" x2="250" y2="125" stroke="black" marker-end="url(#arrow)" />
      <line x1="150" y1="75" x2="250" y2="25" stroke="black" marker-end="url(#arrow)" />

      <!-- Middle Layers -->
      <rect x="250" y="25" width="100" height="50" fill="#facc15" />
      <text x="300" y="55" text-anchor="middle" fill="black">Nothing</text>

      <rect x="250" y="75" width="100" height="50" fill="#f87171" />
      <text x="300" y="105" text-anchor="middle" fill="white">Animals</text>

      <rect x="250" y="125" width="100" height="50" fill="#60a5fa" />
      <text x="300" y="155" text-anchor="middle" fill="white">Processing</text>

      <!-- Food -->
      <rect x="400" y="75" width="100" height="50" fill="#9333ea" />
      <text x="450" y="105" text-anchor="middle" fill="white">Food</text>

      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="black" />
        </marker>
      </defs>
    </svg>
  </div>

  <!-- Buttons -->
  <div class="flex justify-center gap-4">
    <button data-modal-target="plantsModal" class="bg-green-600 text-white px-4 py-2 rounded">Plants Info</button>
    <button data-modal-target="animalsModal" class="bg-red-600 text-white px-4 py-2 rounded">Animals Info</button>
    <button data-modal-target="processingModal" class="bg-blue-600 text-white px-4 py-2 rounded">Processing Info</button>
  </div>
</section>

<!-- Modals -->
<div id="plantsModal" class="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded shadow-lg max-w-md">
    <h3 class="text-xl font-bold mb-4">Plants</h3>
    <p>Information about plant-based food systems...</p>
    <button data-close class="mt-4 bg-gray-700 text-white px-4 py-2 rounded">Close</button>
  </div>
</div>

<div id="animalsModal" class="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded shadow-lg max-w-md">
    <h3 class="text-xl font-bold mb-4">Animals</h3>
    <p>Information about animal-based food systems...</p>
    <button data-close class="mt-4 bg-gray-700 text-white px-4 py-2 rounded">Close</button>
  </div>
</div>

<div id="processingModal" class="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded shadow-lg max-w-md">
    <h3 class="text-xl font-bold mb-4">Processing</h3>
    <p>Information about food processing...</p>
    <button data-close class="mt-4 bg-gray-700 text-white px-4 py-2 rounded">Close</button>
  </div>
</div>
