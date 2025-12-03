<section class="py-12">
  <div class="mx-auto max-w-6xl px-4">
    <div class="flex flex-col md:flex-row md:gap-8 items-center">
      <!-- Left: Chart -->
      <div class="md:w-1/2 w-full">
        <div class="food-chart-outer-container">
          <div class="food-chart-container">
            <div class="food-chart-wrapper">
              <canvas id="foodEmissionsChart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Title + Intro + Button -->
      <div class="flex flex-col md:w-1/2 w-full justify-center">
        <h2 class="text-3xl font-bold mb-4">Making our Food Climate Neutral</h2>
        <div class="prose prose-sm md:prose-base mb-6 text-justify">
          <p>
            Our food system contributes roughly 30% of global greenhouse gas emissions.
            This guide explores where those emissions come from and the most effective
            ways we can reduce them — from production changes to smarter consumption.
          </p>
        </div>
        <div class="flex justify-center">
          <button id="chartLabel" class="chart-label">🥖🥩🥦 Food 30%</button>
        </div>
      </div>
    </div>
  </div>
</section>

